

// ─── Product types (matching DB schema) ─────────────────────────────────────

export type DbProduct = {
  id: string
  slug: string
  price: number
  pieces: number
  weight: string
  ingredients: string
  available: boolean
  is_featured: boolean
  badge: string | null
  image_url: string
  sort_order: number
  created_at: string
  updated_at: string
}

export type DbProductTranslation = {
  id: string
  product_id: string
  locale: string
  name: string
  description: string
  long_description: string
}

export type DbProductFlavor = {
  id: string
  product_id: string
  flavor_key: string
  is_signature: boolean
  sort_order: number
}

export type DbOrder = {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: {
    address: string
    city: string
    postalCode: string
  }
  items: Array<{
    packId: string
    name: string
    price: number
    quantity: number
  }>
  total: number
  payment_method: 'mbway' | 'multibanco'
  payment_status: 'pending' | 'paid' | 'cancelled'
  payment_reference: string | null
  payment_entity: string | null
  payment_expires_at: string | null
  created_at: string
  updated_at: string
}

export type DbAdminUser = {
  id: string
  email: string
  role: 'admin' | 'editor'
  created_at: string
}

// ─── Product with translations (hydrated) ───────────────────────────────────

export type ProductWithTranslations = DbProduct & {
  translations: DbProductTranslation[]
  flavors: DbProductFlavor[]
}
