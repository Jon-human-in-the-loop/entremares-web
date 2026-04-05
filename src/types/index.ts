/**
 * Common TypeScript type definitions for Entremares Web
 */

export type NavLink = {
  label: string
  href: string
  children?: NavLink[]
}

export type GiftPack = {
  id: string
  name: string
  pieces: number
  description: string
  image: string
  price?: number
  available?: boolean
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
