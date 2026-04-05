# PROJECT.md: Entremares Web Project

## Context

Entremares is a premium artisanal alfajores producer based in Argentina, now expanding to sell online in Portugal. This project builds the e-commerce website to showcase gift packs, communicate brand heritage, and enable purchases for the Portuguese market.

## Business Overview

### Brand Identity
- **Product**: Premium artisanal alfajores (Argentine confection) in curated gift packs
- **Market**: Portugal (primary target market)
- **Positioning**: Premium, artisanal, heritage-driven, warm
- **Key Values**: Quality, tradition, craftsmanship, authenticity

### Website Goals
1. **Tell the Brand Story** - Communicate Entremares heritage and artisanal values
2. **Showcase Gift Packs** - Present curated product offerings with clear descriptions
3. **Build Premium Perception** - Visual and textual branding that reflects luxury positioning
4. **Enable Purchases** - Clear product information and purchase path (payment to be implemented)
5. **Market Presence** - Establish online presence in Portuguese market
6. **Email Marketing** - Capture customer emails for future marketing (Phase 3)

### Target Audience
- Gift-givers seeking premium, authentic products
- Those interested in artisanal/heritage products
- Portuguese consumers interested in international premium goods
- Age range: 25-65, affluent, quality-conscious

## Visual & Aesthetic Direction

### Design References
- **brownbee.com.ar** - Warmth, craftsmanship premium feel
- **amsterdambakingcompany.com/collections/alfajores** - Modern artisanal presentation

### Brand Aesthetics
**Color Palette:**
- **Warm Gold** (#d4a574) - Primary brand color, warmth and luxury
- **Honey** (#e8d4b0) - Secondary, light warm tones
- **Earth Brown** (#8b6f47) - Text, interactive elements
- **Dark Brown** (#5c4033) - Headings, strong emphasis
- **Cream** (#faf6f1) - Light backgrounds, breathing room
- **Warm White** (#fefdfb) - Primary background

**Typography:**
- **Headings**: Serif (Garamond/Georgia) - tradition, sophistication
- **Body**: Clean sans-serif (Inter) - readability, modernity
- **Line Height**: Generous (1.6-2) for luxury feel
- **Spacing**: Generous margins and padding

**Visual Language:**
- Premium, artisanal presentation
- High-quality product photography
- Lifestyle/context imagery
- Natural lighting, warm color treatment
- Heritage storytelling
- Clean, minimal layouts
- Intentional whitespace

### Design Elements
- Rounded corners minimal (mostly sharp edges, some subtle rounding)
- Shadows subtle and warm-toned
- Transitions smooth and refined
- Product imagery high-resolution
- No busy patterns; clean aesthetic

## Feature Roadmap

### Phase 1: MVP Foundation (THIS SPRINT)
**Goal**: Establish project structure and static website presence

Features:
- ✓ Project initialization and structure
- ✓ Home page with brand story and featured products
- ✓ Navigation/header component
- ✓ Footer with contact information
- ✓ Basic responsive layout
- ✓ CLAUDE.md and PROJECT.md documentation
- ✓ TypeScript strict mode setup
- ✓ Tailwind CSS with brand colors

Deliverables:
- Initialized Next.js 14 project with TypeScript
- Home page demonstrating brand aesthetic
- Full documentation for future development
- PR with comprehensive setup

### Phase 2: Product Catalog & Shopping (Q1)
- Gift pack listing page with filtering
- Individual product detail pages
- Product images and detailed descriptions
- Price and availability information
- Shopping cart functionality
- User account/registration (basic)

### Phase 3: Content & Engagement (Q2)
- Blog/content section for brand stories
- About page with production process details
- Email newsletter signup integration
- Customer testimonials and reviews
- SEO optimization
- Analytics integration (GA4)

### Phase 4: Advanced Features (Q3+)
- Payment gateway integration (MB WAY, Multibanco via Ifthenpay/EuPago)
- Order management system
- Shipping integration (Portuguese logistics)
- Personalization (gift customization options)
- Admin dashboard for content management
- Multi-language support (Portuguese/English)
- Seasonal promotions and campaigns

## Technical Architecture

### Technology Stack Rationale

| Technology | Choice | Rationale |
|-----------|--------|-----------|
| **Frontend Framework** | Next.js 14+ | Server-side rendering, built-in optimizations, best DX |
| **Language** | TypeScript 5 (strict) | Type safety, IDE support, reduced runtime errors |
| **Styling** | Tailwind CSS 3 | Rapid development, design tokens, small production bundle |
| **Components** | shadcn/ui | High-quality, customizable, fully composable components |
| **React Version** | 19 | Latest features, improved performance patterns |
| **Module System** | ESM | Modern standard, tree-shaking, clean imports |
| **Deployment** | Vercel (recommended) | Optimized for Next.js, seamless DX, automatic scaling |
| **Database** | TBD (Phase 2+) | Not needed for MVP (static content) |
| **Authentication** | TBD (Phase 2+) | Not needed for MVP |
| **Payments** | TBD (Phase 4) | Deferred until shipping/commerce integration |

### Architectural Decisions

**App Router vs Pages Router:**
- Using Next.js App Router for modern patterns
- Supports React Server Components
- Better file organization
- Improved data fetching patterns

**Component Library Choice:**
- shadcn/ui for maximum customization
- MIT licensed, owned by community
- Full control over component source
- Integrates seamlessly with Tailwind

**Styling Strategy:**
- Tailwind CSS first for utility-based design
- CSS variables for brand color system
- No component-specific CSS files
- Design tokens in configuration

**Type Safety:**
- TypeScript strict mode enforced
- All components properly typed
- Reusable type definitions
- No implicit `any` types

### Development Philosophy
- **Functional Components**: Only functional React components
- **Async/Await**: Modern async patterns throughout
- **ESM Imports**: Clean, modern import syntax
- **Single Responsibility**: Components do one thing well
- **Reusability**: DRY principle for components and utilities
- **Performance**: Lazy loading, code splitting, image optimization
- **Accessibility**: Semantic HTML, WCAG compliance target

## Page Structure & Routing

### Current Pages (MVP)
- `/` - Home page (brand story, featured products, CTAs)
- `/public/favicon.ico` - Brand favicon

### Planned Pages (Phase 2+)
- `/gift-packs` - Gift pack catalog and listing
- `/gift-packs/[slug]` - Individual product detail page
- `/about` - About page (brand history, production process)
- `/contact` - Contact form
- `/blog` - Blog/content section (Phase 3)
- `/account` - User account management (Phase 2+)
- `/cart` - Shopping cart (Phase 2)
- `/checkout` - Purchase flow (Phase 2+)

## Development & Deployment

### Local Development
**Environment:**
- Node.js 18+ required
- npm or yarn for package management
- VSCode recommended
- `.editorconfig` enforces 2-space indentation

**Getting Started:**
```bash
npm install
npm run dev  # Starts on localhost:3000
```

**Quality Checks:**
```bash
npx tsc --noEmit     # Type checking
npm run lint          # ESLint
npm run build         # Production build
```

### Deployment Strategy
**Recommended:** Vercel (Next.js creators)
- Automatic deployments from GitHub
- Edge functions support
- Image optimization
- Environment variable management
- Preview deployments for PRs

**Alternative:** Self-hosted
- Any Node.js hosting (AWS, DigitalOcean, etc.)
- Docker containerization option
- Manual deployment via git hooks

### Performance Targets
- Lighthouse scores: 90+ (Performance, Accessibility, Best Practices, SEO)
- Core Web Vitals: Optimal
- First Contentful Paint: < 2s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

### Optimization Strategies
- Next.js Image component for responsive images
- Dynamic imports for non-critical components
- CSS minification via Tailwind
- JavaScript code splitting
- Static generation where possible

## Content & Asset Management

### Brand Assets Required
- Logo (SVG, PNG formats for different sizes)
- Brand color palette (already defined as CSS variables)
- Typography samples (Google Fonts)
- Product photography (high-resolution)
- Lifestyle/brand images
- Icons (consider Heroicons via shadcn/ui)

### Product Information
**Needed for Catalog (Phase 2):**
- Product names and descriptions
- Flavor/variety information
- Pricing
- Pack sizes and contents
- Ingredient lists
- Storage/expiration information
- Gift packaging options

### Content Strategy
1. **Homepage**: Brand story, featured products, call-to-action
2. **Product Pages**: Detailed descriptions, imagery, pricing
3. **About**: Brand heritage, production process, values
4. **Blog/Content**: Seasonal offerings, gift guides, brand stories (Phase 3)

## Success Metrics

### Phase 1 (MVP)
- ✓ TypeScript strict mode compilation
- ✓ Homepage renders correctly responsive
- ✓ All navigation functional
- ✓ Documentation complete
- ✓ Clean Git history with atomic commits

### Phase 2 (Product Catalog)
- Product listing page loads correctly
- Product detail pages SEO-optimized
- Shopping cart functional
- <2s page load time
- Mobile responsiveness verified

### Phase 3 (Engagement)
- Email signup capture functionality
- Blog posts indexed by search engines
- Social sharing functionality
- User testimonials section populated

### Phase 4 (E-Commerce)
- Payment gateway integration successful
- Order processing functional
- Conversion rate target: 2-5% initial
- Customer satisfaction metrics

## Dependencies & Constraints

### Technical Constraints
- TypeScript strict mode non-negotiable
- Tailwind CSS for all styling
- shadcn/ui for component library
- 2-space indentation throughout
- ESM imports exclusively
- Functional components only
- Node.js 18+ minimum

### Business Constraints
- Portuguese market focus initially
- No shipping configuration in Phase 1
- Payment processing deferred to Phase 4
- Budget-conscious (leverage free/open-source tools)
- GDPR compliance for EU market

### Timeline Constraints
- MVP needed for market entry discussions
- Phase 2 needed for actual sales
- Payment integration critical for revenue
- Content creation ongoing

## Key Integration Points (Future Phases)

### Payment Gateway (Phase 4)
- MB WAY integration (Portuguese mobile payment)
- Multibanco integration (Portuguese bank transfer)
- Via Ifthenpay or EuPago providers

### Email Marketing (Phase 3)
- Newsletter signup form
- Email service provider integration (TBD)
- Automated welcome sequence

### Analytics (Phase 3)
- Google Analytics 4 setup
- Conversion tracking
- User behavior insights

### CMS Consideration (Phase 3+)
- Blog content management
- Product management interface
- Consider: Contentful, Strapi, or Headless CMS

## File Structure Reference

See CLAUDE.md for detailed file structure and organization conventions.

## Risk Mitigation

**Technical Risks:**
- TypeScript setup: Mitigated by strict mode from start
- Tailwind customization: Reference docs and examples
- Component library learning: shadcn/ui has excellent docs
- Performance: Use Next.js built-in optimizations

**Business Risks:**
- Market acceptance: MVP validates concept early
- Payment integration complexity: Deferred to Phase 4
- Content availability: Plan content production early
- Shipping logistics: Phase 4 planning starts in Phase 2

## Next Steps

1. **Approve Project Initialization PR** - Foundation complete
2. **Plan Phase 2 Development** - Product catalog and shopping
3. **Gather Product Information** - Prepare content for catalog
4. **Design Product Photography** - Commission high-quality images
5. **Plan Payment Integration** - Research Portuguese payment providers
6. **Develop Content Strategy** - Blog, storytelling, marketing content

---

**Project Owner**: Entremares
**Version**: 1.0
**Last Updated**: 2024
**Status**: MVP Phase - In Development
