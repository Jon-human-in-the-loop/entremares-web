/**
 * Brand and application constants
 */

export const BRAND = {
  name: 'Entremares',
  tagline: 'Premium Artisanal Alfajores',
  description: 'Discover the rich heritage of craftsmanship in every bite. Our artisanal alfajores are handcrafted with passion using traditional methods and premium ingredients.',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://entremares.pt',
} as const

export const SITE_METADATA = {
  title: `${BRAND.name} - ${BRAND.tagline}`,
  description: BRAND.description,
  lang: 'en',
  locale: 'en_US',
  twitterHandle: '@entremares',
} as const

export const NAVIGATION = [
  { label: 'Home', href: '/' },
  { label: 'Gift Packs', href: '/gift-packs' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const

export const COLORS = {
  warmGold: '#d4a574',
  honey: '#e8d4b0',
  earthBrown: '#8b6f47',
  darkBrown: '#5c4033',
  cream: '#faf6f1',
  warmWhite: '#fefdfb',
} as const

export const GIFT_PACKS = [
  {
    id: 'classic-6',
    name: 'Classic Pack',
    pieces: 6,
    description: 'A delightful selection of our signature flavors. Perfect for first-time tasters.',
    image: '/images/packs/classic-6.jpg',
  },
  {
    id: 'premium-12',
    name: 'Premium Pack',
    pieces: 12,
    description: 'Our most popular selection. A complete experience of artisanal craftsmanship.',
    image: '/images/packs/premium-12.jpg',
  },
  {
    id: 'special-edition',
    name: 'Special Edition',
    pieces: 12,
    description: 'Limited edition flavors and premium gift packaging for special occasions.',
    image: '/images/packs/special-edition.jpg',
  },
] as const
