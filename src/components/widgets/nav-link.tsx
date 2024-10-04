'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingCart, Users, LineChart } from 'lucide-react'
import { cn } from "@/lib/utils"

type NavLinkProps = {
  href: string
  children: React.ReactNode
  icon: React.ElementType
}

const NavLink = ({ href, children, icon: Icon }: NavLinkProps) => {
  const pathname = usePathname()
  const isActive = pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
        isActive 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:text-primary hover:bg-primary/5"
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  )
}

type DashboardNavProps = {
  role: string | undefined
}

export default function DashboardNav({ role }: DashboardNavProps) {
  return (
    <div className="flex-1">
      <nav className="grid items-start gap-2 px-2 text-sm font-medium lg:px-4">
        {role === "ADMIN" && (
          <>
            <NavLink href="/dashboard/admin/home" icon={Home}>
              Dashboard
            </NavLink>
            <NavLink href="/dashboard/admin/jobs" icon={ShoppingCart}>
              Jobs
            </NavLink>
            <NavLink href="/dashboard/admin/stakeholders" icon={Users}>
              Stakeholders
            </NavLink>
            <NavLink href="/dashboard/admin/analytics" icon={LineChart}>
              Analytics
            </NavLink>
          </>
        )}
        {role === "STAKEHOLDER" && (
          <>
            {/* <NavLink href="/dashboard/user/home" icon={Home}>
              Dashboard
            </NavLink> */}
            <NavLink href="/dashboard/user/jobs" icon={ShoppingCart}>
              Jobs
            </NavLink>
          </>
        )}
      </nav>
    </div>
  )
}
