import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin')

  // New product
  if (id === 'new') {
    return <ProductForm />
  }

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) notFound()

  const [{ data: translations }, { data: flavors }] = await Promise.all([
    supabase.from('product_translations').select('*').eq('product_id', id),
    supabase.from('product_flavors').select('*').eq('product_id', id).order('sort_order'),
  ])

  return <ProductForm product={product} translations={translations ?? []} flavors={flavors ?? []} />
}
