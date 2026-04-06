import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import type { DbOrder } from '@/lib/supabase/types'

const STATUS_STYLE: Record<string, string> = {
  pending:   'bg-warm-gold/15 text-warm-gold',
  paid:      'bg-sage/15 text-sage',
  cancelled: 'bg-red-50 text-red-500',
}

export default async function AdminOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin')

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-dark-brown">Orders</h1>
        <p className="text-sm text-text-muted font-sans mt-1">{orders?.length ?? 0} total orders</p>
      </div>

      <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-warm-white border-b border-border-light">
              {['Order ID', 'Customer', 'Total', 'Method', 'Status', 'Date'].map(h => (
                <th key={h} className="px-5 py-4 text-left text-xs font-sans font-semibold text-text-muted uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {!orders?.length && (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-text-muted font-sans">No orders yet.</td></tr>
            )}
            {orders?.map((order: DbOrder) => (
              <tr key={order.id} className="hover:bg-warm-white/40 transition-colors">
                <td className="px-5 py-4">
                  <p className="text-xs font-mono font-semibold text-dark-brown">{order.id}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-sans font-medium text-dark-brown">{order.customer_name}</p>
                  <p className="text-xs text-text-muted font-sans">{order.customer_email}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm font-serif font-bold text-dark-brown">{formatPrice(order.total)}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs font-sans uppercase tracking-widest text-text-secondary">{order.payment_method}</span>
                  {order.payment_reference && (
                    <p className="text-xs font-mono text-text-muted mt-0.5">{order.payment_reference}</p>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-sans uppercase tracking-wider px-2.5 py-1 rounded-full ${STATUS_STYLE[order.payment_status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {order.payment_status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <p className="text-xs text-text-muted font-sans">
                    {new Date(order.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
