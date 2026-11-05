/**
 * Owner-supplied About-page content.
 *
 * Every field starts EMPTY on purpose. A section is shown on the public site
 * only when its text is filled in — nothing is invented. Fill these in with
 * true, verifiable statements (see BUSINESS_SETUP.md).
 */
export const aboutContent = {
  mission: "",
  vision: "",
  /** { title: "Compassion", text: "…" } */
  values: [] as { title: string; text: string }[],
  /** Paragraphs. Do not invent history or achievements. */
  story: [] as string[],
  /**
   * Describe staff ONLY in ways that are true and documented,
   * e.g. "Our nurses are registered with PNMC" — only if verified.
   */
  team: {
    intro: "",
    groups: [] as { title: string; text: string }[],
  },
}
