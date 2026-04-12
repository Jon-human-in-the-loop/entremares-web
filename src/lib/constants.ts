import type { GiftPack } from '@/types'

export const BRAND = {
  name: 'Entremares',
  tagline: 'Premium Artisanal Alfajores',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://entremares.pt',
} as const

export const GIFT_PACKS: GiftPack[] = [
  {
    id: 'pistache-intenso',
    slug: 'pistache-intenso',
    name: 'Pistache intenso',
    pieces: 1,
    price: 350,
    available: true,
    isFeatured: true,
    description: 'Alfajor artesanal de pistache intenso.',
    longDescription: 'Delicioso alfajor elaborado con una crema suave y profunda de pistache intenso.',
    image: '',
    weight: '60g',
    ingredients: 'Pistache, dulce de leche, harina.',
    flavors: [
      { id: 'pistache', name: 'Pistache intenso', description: 'Crema de pistache' }
    ],
  },
  {
    id: 'chocolate-blanco-con-nuez',
    slug: 'chocolate-blanco-con-nuez',
    name: 'Chocolate blanco con nuez',
    pieces: 1,
    price: 350,
    available: true,
    isFeatured: true,
    description: 'Alfajor cubierto en chocolate blanco con trozos de nuez.',
    longDescription: 'Alfajor artesanal cubierto en fino chocolate blanco y espolvoreado con nuez crujiente.',
    image: '',
    weight: '60g',
    ingredients: 'Chocolate blanco, nueces, dulce de leche.',
    flavors: [
      { id: 'choco-blanco', name: 'Chocolate blanco con nuez', description: 'Chocolate y nuez' }
    ],
  },
  {
    id: 'vinho-do-porto',
    slug: 'vinho-do-porto',
    name: 'Vinho do porto',
    pieces: 1,
    price: 350,
    available: true,
    isFeatured: true,
    description: 'Alfajor con un toque auténtico de Vinho do Porto.',
    longDescription: 'Alfajor premium con relleno sutilmente infusionado con el clásico Vinho do Porto.',
    image: '',
    weight: '60g',
    ingredients: 'Vinho do porto, masa de cacao, dulce de leche.',
    flavors: [
      { id: 'vinho-porto', name: 'Vinho do porto', description: 'Infusión de Oporto' }
    ],
  },
  {
    id: 'caramelo-salado',
    slug: 'caramelo-salado',
    name: 'Caramelo salado',
    pieces: 1,
    price: 350,
    available: true,
    isFeatured: true,
    description: 'Equilibrio perfecto de dulce y salado.',
    longDescription: 'Exquisito alfajor cuyo dulce de leche se mezcla con delicados toques de caramelo y sal.',
    image: '',
    weight: '60g',
    ingredients: 'Caramelo, sal marina, harina.',
    flavors: [
      { id: 'caramelo-salado', name: 'Caramelo salado', description: 'Caramelo con toque de sal' }
    ],
  },
  {
    id: 'chocolate-intenso',
    slug: 'chocolate-intenso',
    name: 'Chocolate intenso',
    pieces: 1,
    price: 350,
    available: true,
    isFeatured: true,
    description: 'Para los amantes del cacao profundo.',
    longDescription: 'Alfajor oscuro sumergido en chocolate amargo de alta pureza.',
    image: '',
    weight: '60g',
    ingredients: 'Cacao amargo, chocolate 70%, dulce de leche.',
    flavors: [
      { id: 'choco-intenso', name: 'Chocolate intenso', description: 'Cacao profundo' }
    ],
  },
]

export const NAVIGATION = [
  { label: 'home', href: '/' },
  { label: 'giftPacks', href: '/gift-packs' },
  { label: 'about', href: '/about' },
  { label: 'contact', href: '/contact' },
] as const
