import { expect, test, type Page } from "@playwright/test"
import { services } from "../data/services"

// Next.js injects its own role=alert route announcer; exclude it.
const alerts = (page: Page) => page.locator("[role=alert]:not(#__next-route-announcer__)")

const SERVICE_TITLE = services[0].title

async function adminLogin(page: Page, email: string, password: string) {
  await page.goto("/admin/login")
  await page.getByLabel("Email").fill(email)
  await page.getByLabel("Password").fill(password)
  await page.getByRole("button", { name: "Sign in" }).click()
  if (!password.startsWith("wrong")) await page.waitForURL(/\/admin$/)
}

test.describe.serial("end-to-end journeys", () => {
  test("public: no coverage configured → honest 'not open yet', no fake form", async ({ page }) => {
    await page.goto("/request-care")
    await expect(page.getByRole("heading", { name: "Online requests are not open yet" })).toBeVisible()
  })

  test("admin: unauthenticated access is redirected; wrong password rejected", async ({ page, request }) => {
    await page.goto("/admin/leads")
    await expect(page).toHaveURL(/\/admin\/login/)
    const res = await request.get("/admin/leads/export", { maxRedirects: 0 })
    expect([307, 401]).toContain(res.status())
    await adminLogin(page, "admin@e2e.test", "wrong-password-123")
    await expect(alerts(page)).toContainText("Invalid email or password")
  })

  test("admin: login, then configure city, area and coverage", async ({ page }) => {
    await adminLogin(page, "admin@e2e.test", "E2e-Admin-Pass-123")
    await expect(page).toHaveURL(/\/admin$/)
    await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible()

    await page.goto("/admin/coverage")
    await page.getByLabel("City name").fill("Karachi")
    await page.getByLabel("City slug").fill("karachi")
    await page.getByRole("button", { name: "Add city" }).click()
    await expect(page.getByRole("heading", { name: "Karachi" })).toBeVisible()
    await page.getByRole("button", { name: "Activate", exact: true }).first().click()
    const deactivate = page.getByRole("button", { name: "Deactivate", exact: true })
    await expect(deactivate).toHaveCount(1) // city is now active

    await page.getByLabel("Area name").fill("Clifton")
    await page.getByLabel("Area slug").fill("clifton")
    await page.getByRole("button", { name: "Add area" }).click()
    await expect(page.getByRole("heading", { name: "Clifton" })).toBeVisible()
    // activate the area (second Activate button: city is now Deactivate)
    await page.getByRole("button", { name: "Activate", exact: true }).first().click()
    await expect(deactivate).toHaveCount(2) // area is now active too

    const sel = page.getByLabel(`${SERVICE_TITLE} in Clifton`)
    await sel.selectOption("available")
    await sel.locator("xpath=following-sibling::button").click()
    // Prove it was persisted server-side (reload until the server renders it), not just client state.
    await expect(async () => {
      await page.reload()
      await expect(page.getByLabel(`${SERVICE_TITLE} in Clifton`)).toHaveValue("available", { timeout: 2_000 })
    }).toPass({ timeout: 20_000 })
  })

  test("admin: activating a service with placeholder content is refused", async ({ page }) => {
    await adminLogin(page, "admin@e2e.test", "E2e-Admin-Pass-123")
    await page.goto("/admin/services")
    await expect(page.getByText("Content incomplete — cannot activate").first()).toBeVisible()
  })

  test("public: availability checker reflects configured coverage", async ({ page }) => {
    await page.goto("/areas-we-serve")
    await page.getByLabel("City", { exact: true }).selectOption("karachi")
    await page.getByLabel("Area", { exact: true }).selectOption("clifton")
    await page.getByLabel("Service", { exact: true }).selectOption({ label: SERVICE_TITLE })
    await page.getByRole("button", { name: "Check availability" }).click()
    await expect(page.getByText("Service available")).toBeVisible()
  })

  test("public: multi-step request → real reference; validation blocks bad input", async ({ page }) => {
    await page.goto("/request-care")
    await page.getByLabel(SERVICE_TITLE).check()
    await page.getByRole("button", { name: "Continue" }).click()

    // Step 2: location + live availability
    await page.getByLabel("City *").selectOption("karachi")
    await page.getByLabel("Area / locality *").selectOption("clifton")
    await expect(page.getByText("This service is available in your area")).toBeVisible()
    await page.getByRole("button", { name: "Continue" }).click()

    // Step 3: requirements — must choose type
    await page.getByRole("button", { name: "Continue" }).click()
    await expect(alerts(page).first()).toContainText("one-time or recurring")
    await page.getByLabel("One-time").check()
    await page.getByRole("button", { name: "Continue" }).click()

    // Step 4: invalid phone blocked client-side
    await page.getByLabel("Full name *").fill("E2E Family Member")
    await page.getByLabel("Mobile number *").fill("12345")
    await page.getByRole("button", { name: "Continue" }).click()
    await expect(alerts(page).first()).toContainText("Pakistani mobile number")
    await page.getByLabel("Mobile number *").fill("0300 1234567")
    await page.getByRole("button", { name: "Continue" }).click()

    // Step 5: privacy required
    await page.waitForTimeout(3200) // server rejects implausibly fast submissions
    await page.getByRole("button", { name: "Submit request" }).click()
    await expect(alerts(page).first()).toContainText("privacy notice")
    await page.getByLabel(/I have read the Privacy Policy/).check()
    await page.getByRole("button", { name: "Submit request" }).click()

    const ref = page.getByTestId("reference")
    await expect(ref).toHaveText(/^WWPC-CR-[A-Z0-9]{6}$/)
    await expect(page.getByText("not a confirmed appointment")).toBeVisible()
  })

  test("public: contact form stores message and shows reference", async ({ page }) => {
    await page.goto("/contact")
    await page.getByLabel("Full name *").fill("E2E Contact")
    await page.getByLabel("Mobile number *").fill("+92 321 7654321")
    await page.getByLabel("Subject *").fill("Testing the contact form")
    await page.getByLabel("Message *").fill("This is an automated end-to-end test message.")
    await page.getByLabel(/I have read the/).check()
    await page.waitForTimeout(3200)
    await page.getByRole("button", { name: "Send message" }).click()
    await expect(page.getByTestId("reference")).toHaveText(/^WWPC-CM-[A-Z0-9]{6}$/)
  })

  test("admin: lead appears, can be updated, noted; contact message visible", async ({ page }) => {
    await adminLogin(page, "admin@e2e.test", "E2e-Admin-Pass-123")
    await page.goto("/admin/leads")
    await page.getByRole("link", { name: /^WWPC-CR-/ }).first().click()
    await expect(page.getByText("+923001234567")).toBeVisible()
    await page.waitForLoadState("networkidle") // let React hydrate before touching uncontrolled inputs
    await page.getByLabel("Status").selectOption("contacted")
    await expect(page.getByLabel("Status")).toHaveValue("contacted")
    await page.getByRole("button", { name: "Save" }).click()
    await page.getByLabel("New note").fill("Called family; assessment discussed.")
    await page.getByRole("button", { name: "Add note" }).click()
    await expect(page.getByText("Called family; assessment discussed.")).toBeVisible()

    // Status change must be persisted server-side: poll the filtered list.
    await expect(async () => {
      await page.goto("/admin/leads?status=contacted")
      await expect(page.getByRole("link", { name: /^WWPC-CR-/ })).toHaveCount(1, { timeout: 2_000 })
    }).toPass({ timeout: 20_000 })
    await page.goto("/admin/messages")
    await expect(page.getByText("Testing the contact form")).toBeVisible()
    await page.goto("/admin/audit")
    await expect(page.getByText("lead.update").first()).toBeVisible()
  })

  test("admin: staff role is denied coverage and audit pages", async ({ page }) => {
    await adminLogin(page, "staff@e2e.test", "E2e-Staff-Pass-123")
    await expect(page).toHaveURL(/\/admin$/)
    await page.goto("/admin/coverage")
    await expect(page).toHaveURL(/denied=1/)
    await page.goto("/admin/audit")
    await expect(page).toHaveURL(/denied=1/)
  })

  test("admin: sign out ends the session server-side", async ({ page }) => {
    await adminLogin(page, "admin@e2e.test", "E2e-Admin-Pass-123")
    await page.getByRole("button", { name: "Sign out" }).click()
    await expect(page).toHaveURL(/\/admin\/login/)
    await page.goto("/admin/leads")
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  for (const width of [320, 375, 390, 768, 1024, 1440]) {
    test(`responsive: no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      for (const path of ["/", "/services", "/areas-we-serve", "/contact", "/request-care", "/faq"]) {
        await page.goto(path)
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
        expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0)
      }
    })
  }

  test("seo: robots, sitemap, 404, security headers, admin noindex", async ({ request, page }) => {
    const robots = await (await request.get("/robots.txt")).text()
    expect(robots).toContain("Disallow: /admin")
    const sitemap = await (await request.get("/sitemap.xml")).text()
    expect(sitemap).toContain("/services")
    expect(sitemap).not.toContain("/admin")
    const res = await request.get("/definitely-not-a-page")
    expect(res.status()).toBe(404)
    expect(res.headers()["x-content-type-options"]).toBe("nosniff")
    const admin = await request.get("/admin/login")
    expect(admin.headers()["x-robots-tag"]).toContain("noindex")
    await page.goto("/")
    await expect(page.locator("link[rel=canonical]")).toHaveCount(1)
  })
})
