import type { GiftPack } from '@/types'

export const BRAND = {
  name: 'Entremares',
  tagline: 'Premium Handcrafted Alfajores',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://entremares.pt',
} as const

export const GIFT_PACKS: GiftPack[] = [
  {
    id: 'classic-6',
    slug: 'classic-6',
    name: 'Pack Clássico',
    pieces: 6,
    price: 1890,
    available: true,
    isFeatured: true,
    description: 'Uma seleção deliciosa dos nossos sabores mais icónicos. Perfeito para uma primeira experiência.',
    longDescription: 'O Pack Clássico é uma introdução perfeita aos alfajores Entremares. Cada peça é feita à mão com ingredientes premium e técnicas tradicionais, refletindo séculos de herança artesanal. Esta seleção curada oferece uma experiência completa dos nossos sabores mais amados.',
    image: '/images/packs/classic-6.jpg',
    weight: '180g',
    ingredients: 'Farinha de trigo, manteiga, dulce de leche, chocolate de cobertura.',
    flavors: [
      { id: 'dulce-leche', name: 'Dulce de Leche', description: 'O clássico original', isSignature: true },
      { id: 'chocolate', name: 'Chocolate', description: 'Cobertura de chocolate belga' },
      { id: 'limon', name: 'Limão', description: 'Creme de limão artesanal' },
    ],
  },
  {
    id: 'premium-12',
    slug: 'premium-12',
    name: 'Pack Premium',
    pieces: 12,
    price: 3290,
    available: true,
    isFeatured: true,
    badge: 'mostPopular',
    description: 'A nossa seleção mais completa. Uma experiência artesanal de excelência.',
    longDescription: 'O Pack Premium é o nosso bestseller, oferecendo uma variedade impressionante de sabores premium. Com 12 peças cuidadosamente selecionadas, é o presente perfeito para quem aprecia qualidade e diversidade. Ideal para compartilhar ou para um presente muito especial.',
    image: '/images/packs/premium-12.jpg',
    weight: '360g',
    ingredients: 'Farinha de trigo, manteiga, dulce de leche, chocolate de cobertura, framboesa.',
    flavors: [
      { id: 'dulce-leche', name: 'Dulce de Leche', description: 'O clássico original', isSignature: true },
      { id: 'chocolate', name: 'Chocolate', description: 'Cobertura de chocolate belga' },
      { id: 'limon', name: 'Limão', description: 'Creme de limão artesanal' },
      { id: 'framboesa', name: 'Framboesa', description: 'Doce de framboesa caseiro' },
      { id: 'cafe', name: 'Café', description: 'Ganache de café expresso' },
    ],
  },
  {
    id: 'special-edition',
    slug: 'special-edition',
    name: 'Edição Especial',
    pieces: 12,
    price: 4490,
    available: true,
    isFeatured: true,
    badge: 'limitedEdition',
    description: 'Sabores de edição limitada em embalagem premium para ocasiões especiais.',
    longDescription: 'A Edição Especial é o auge da arte de fazer alfajores. Com ingredientes raros e sabores inovadores, cada peça é uma obra-prima. Embalagem premium com apresentação que reflete a qualidade excepcional do produto. Disponível em quantidade limitada.',
    image: '/images/packs/special-edition.jpg',
    weight: '360g',
    ingredients: 'Farinha de trigo, manteiga, dulce de leche, chocolate belga, pistácio, flor de sal.',
    flavors: [
      { id: 'pistacio', name: 'Pistácio', description: 'Creme artesanal de pistácio' },
      { id: 'flor-sal', name: 'Flor de Sal', description: 'Dulce de leche com flor de sal do Algarve' },
      { id: 'trufa', name: 'Trufa Negra', description: 'Ganache de trufa com chocolate negro 70%' },
    ],
  },
]

export const NAVIGATION = [
  { label: 'home', href: '/' },
  { label: 'giftPacks', href: '/gift-packs' },
  { label: 'about', href: '/about' },
  { label: 'contact', href: '/contact' },
] as const
