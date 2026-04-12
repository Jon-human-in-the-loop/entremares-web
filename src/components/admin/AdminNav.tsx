'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  ChevronRight,
} from 'lucide-react'

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/products',  label: 'Products',   icon: Package },
  { href: '/admin/orders',    label: 'Orders',     icon: ShoppingBag },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router   = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin')
    router.refresh()
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-dark-brown text-cream flex flex-col z-50">
      {/* Brand */}
      <div className="px-6 py-8 border-b border-white/10">
        <p className="font-serif text-xl font-bold tracking-widest uppercase">Entremares</p>
        <p className="text-[10px] text-cream/40 font-sans tracking-[0.25em] uppercase mt-1">Admin Panel</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans font-medium transition-all ${
                active
                  ? 'bg-white/15 text-cream'
                  : 'text-cream/60 hover:bg-white/8 hover:text-cream'
              }`}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
              {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans font-medium text-cream/50 hover:text-cream hover:bg-white/8 transition-all w-full"
        >
          <LogOut size={17} strokeWidth={1.8} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
