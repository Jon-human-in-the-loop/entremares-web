import { createClient } from '@/lib/supabase/server'
import type { GiftPack } from '@/types'
import type { ProductWithTranslations } from '@/lib/supabase/types'

function hydrate(row: ProductWithTranslations, locale: string): GiftPack {
  const t = row.translations.find((t) => t.locale === locale) ??
            row.translations.find((t) => t.locale === 'es') ??
            row.translations[0]

  return {
    id:              row.slug,
    slug:            row.slug,
    name:            t?.name             ?? row.slug,
    description:     t?.description      ?? '',
    longDescription: t?.long_description ?? '',
    image:           row.image_url,
    price:           row.price,
    pieces:          row.pieces,
    weight:          row.weight,
    ingredients:     row.ingredients,
    available:       row.available,
    isFeatured:      row.is_featured,
    badge:           row.badge ?? undefined,
    flavors: row.flavors
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((f) => ({
        id:          f.flavor_key,
        name:        f.flavor_key, // translated at component level via packFlavors namespace
        description: '',
        isSignature: f.is_signature,
      })),
  }
}

export async function getProducts(locale: string): Promise<GiftPack[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      translations: product_translations(*),
      flavors: product_flavors(*)
    `)
    .eq('available', true)
    .order('sort_order')

  if (error || !data) {
    console.error('getProducts error:', error)
    return []
  }

  return (data as ProductWithTranslations[]).map((p) => hydrate(p, locale))
}

export async function getProductBySlug(slug: string, locale: string): Promise<GiftPack | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      translations: product_translations(*),
      flavors: product_flavors(*)
    `)
    .eq('slug', slug)
    .single()

  if (error || !data) return null

  return hydrate(data as ProductWithTranslations, locale)
}
