import { navigation } from "@/config/navigation"
import { NavLink } from "./NavLink"

export function Nav() {
  return (
    <nav
      aria-label="Main navigation"
      className="hidden lg:flex items-center gap-2 xl:gap-3"
    >
      {navigation.main.map((item) => (
        <NavLink key={item.href} href={item.href}>
          {item.name}
        </NavLink>
      ))}
    </nav>
  )
}