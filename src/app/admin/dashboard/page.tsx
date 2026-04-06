import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Package, ShoppingBag, TrendingUp, Clock } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin')

  // Fetch stats
  const [{ count: totalProducts }, { count: totalOrders }, { data: recentOrders }, { data: revenue }] =
    await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('id,customer_name,total,payment_status,payment_method,created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('orders').select('total').eq('payment_status', 'paid'),
    ])

  const totalRevenue = revenue?.reduce((sum, o) => sum + o.total, 0) ?? 0
  const pendingOrders = recentOrders?.filter(o => o.payment_status === 'pending').length ?? 0

  const stats = [
    { label: 'Total Products',  value: totalProducts ?? 0,          icon: Package,     color: 'bg-dark-brown/10 text-dark-brown' },
    { label: 'Total Orders',    value: totalOrders ?? 0,            icon: ShoppingBag, color: 'bg-sage/15 text-sage' },
    { label: 'Revenue (Paid)',  value: formatPrice(totalRevenue),   icon: TrendingUp,  color: 'bg-warm-gold/15 text-warm-gold' },
    { label: 'Pending Payment', value: pendingOrders,               icon: Clock,       color: 'bg-red-50 text-red-500' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-dark-brown">Dashboard</h1>
        <p className="text-sm text-text-muted font-sans mt-1">Welcome back, {user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-border-light p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
              <Icon size={18} strokeWidth={1.8} />
            </div>
            <p className="text-2xl font-serif font-bold text-dark-brown">{value}</p>
            <p className="text-xs text-text-muted font-sans mt-1 uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border-light flex items-center justify-between">
          <h2 className="font-serif font-bold text-dark-brown">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-text-muted font-sans hover:text-dark-brown transition-colors uppercase tracking-wider">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-border-light">
          {!recentOrders?.length && (
            <p className="px-6 py-8 text-sm text-text-muted font-sans text-center">No orders yet.</p>
          )}
          {recentOrders?.map((order) => (
            <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-warm-white/50 transition-colors">
              <div>
                <p className="text-sm font-sans font-semibold text-dark-brown">{order.customer_name}</p>
                <p className="text-xs text-text-muted font-sans mt-0.5">{order.id} · {order.payment_method.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-serif font-bold text-dark-brown">{formatPrice(order.total)}</p>
                <span className={`text-[10px] font-sans uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block ${
                  order.payment_status === 'paid'
                    ? 'bg-sage/15 text-sage'
                    : order.payment_status === 'cancelled'
                    ? 'bg-red-50 text-red-500'
                    : 'bg-warm-gold/15 text-warm-gold'
                }`}>
                  {order.payment_status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
