export type GiftPackFlavor = {
  id: string
  name: string
  description: string
  isSignature?: boolean
}

export type GiftPack = {
  id: string
  slug: string
  name: string
  pieces: number
  description: string
  longDescription: string
  image: string
  price: number // in EUR cents
  available: boolean
  flavors: GiftPackFlavor[]
  ingredients: string
  weight: string
  isFeatured?: boolean
  badge?: string
}

export type CartItem = {
  pack: GiftPack
  quantity: number
}

export type CartState = {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

export type NavLink = {
  label: string
  href: string
  children?: NavLink[]
}

export type ContactFormData = {
  name: string
  email: string
  message: string
}

export type EmailSubscription = {
  email: string
  subscribedAt?: Date
}
