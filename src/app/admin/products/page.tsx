import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { formatPrice } from '@/lib/utils'


export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin')

  const { data: products } = await supabase
    .from('products')
    .select(`*, translations: product_translations(locale, name)`)
    .order('sort_order')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-dark-brown">Products</h1>
          <p className="text-sm text-text-muted font-sans mt-1">{products?.length ?? 0} products in catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-dark-brown text-cream font-sans font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-dark-brown/90 transition-all"
        >
          <Plus size={16} />
          New Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-warm-white border-b border-border-light">
              <th className="px-6 py-4 text-left text-xs font-sans font-semibold text-text-muted uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-left text-xs font-sans font-semibold text-text-muted uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-left text-xs font-sans font-semibold text-text-muted uppercase tracking-wider">Pieces</th>
              <th className="px-6 py-4 text-left text-xs font-sans font-semibold text-text-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-sans font-semibold text-text-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {!products?.length && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-text-muted font-sans">
                  No products yet. <Link href="/admin/products/new" className="text-dark-brown underline">Add your first product.</Link>
                </td>
              </tr>
            )}
            {products?.map((product: any) => {
              const esName = product.translations?.find((t: any) => t.locale === 'es')?.name ?? product.slug
              return (
                <tr key={product.id} className="hover:bg-warm-white/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {product.image_url && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                          <img src={product.image_url} alt={esName} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-sans font-semibold text-dark-brown">{esName}</p>
                        <p className="text-xs text-text-muted font-sans mt-0.5">/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-serif font-bold text-dark-brown">{formatPrice(product.price)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-sans text-text-secondary">{product.pieces} pcs</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-sans uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      product.available ? 'bg-sage/15 text-sage' : 'bg-red-50 text-red-500'
                    }`}>
                      {product.available ? 'Available' : 'Hidden'}
                    </span>
                    {product.badge && (
                      <span className="ml-2 text-[10px] font-sans uppercase tracking-wider px-2.5 py-1 rounded-full bg-warm-gold/15 text-warm-gold">
                        {product.badge === 'mostPopular' ? 'Popular' : 'Limited'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="flex items-center gap-1.5 text-xs font-sans font-medium text-dark-brown hover:underline"
                    >
                      <Pencil size={13} />
                      Edit
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
