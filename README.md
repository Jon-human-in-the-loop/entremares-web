# Entremares Web

Premium artisanal alfajores gift packs with a rich heritage of craftsmanship.

Entremares is an Argentine producer of artisanal alfajores expanding to the Portuguese market. This website showcases our premium gift packs and brand heritage.

## Quick Start

### Prerequisites
- Node.js 18+ (check with `node --version`)
- npm (comes with Node.js)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

The development server will auto-reload as you make changes.

### Production Build

```bash
# Build for production
npm run build

# Run production build locally
npm start

# Type checking without emitting files
npx tsc --noEmit

# Linting
npm run lint
```

## Project Structure

```
entremares-web/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with metadata
│   │   ├── page.tsx           # Home page
│   │   ├── globals.css        # Global Tailwind styles
│   │   └── favicon.ico        # Brand favicon
│   ├── components/            # React components
│   │   └── ui/               # shadcn/ui components
│   ├── lib/
│   │   ├── utils.ts          # Utility functions (cn for classnames)
│   │   └── constants.ts      # Brand constants and metadata
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   └── styles/
│       └── variables.css     # CSS custom properties for brand colors
├── public/                    # Static assets
├── .editorconfig             # Editor configuration (2-space indent)
├── .gitignore               # Git ignore rules
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript strict mode config
├── package.json             # Project dependencies
├── CLAUDE.md                # Developer guidelines for Claude & team
├── PROJECT.md               # Business context and architecture
└── README.md                # This file
```

## Technology Stack

### Core Framework
- **Next.js 14+** - React meta-framework for production
- **React 19** - Latest React with improved performance
- **TypeScript 5** - Type-safe development with strict mode

### Styling & UI
- **Tailwind CSS 3** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components (installed as needed)
- **CSS Variables** - Brand color system in `src/styles/variables.css`

### Code Quality
- **TypeScript Strict Mode** - Maximum type safety
- **ESLint** - Code quality and consistency
- **2-space indentation** - Enforced via .editorconfig

## Brand Color Palette

Defined in `src/styles/variables.css` and configured in Tailwind:

- **Warm Gold** (#d4a574) - Primary brand color
- **Honey** (#e8d4b0) - Secondary light warm tone
- **Earth Brown** (#8b6f47) - Text and interactive elements
- **Dark Brown** (#5c4033) - Headings and emphasis
- **Cream** (#faf6f1) - Light backgrounds
- **Warm White** (#fefdfb) - Primary background

## Key Features (Current)

### MVP Phase (Current)
- ✓ Premium artisanal brand presentation
- ✓ Home page with brand story and featured gift packs
- ✓ Responsive design (mobile, tablet, desktop)
- ✓ Navigation and footer components
- ✓ TypeScript strict mode for type safety
- ✓ Tailwind CSS with custom brand colors
- ✓ Dark mode ready (CSS variables support)

### Planned Features (Phase 2+)
- Gift pack catalog with filtering
- Individual product detail pages
- Shopping cart functionality
- User accounts and authentication
- Payment gateway integration (MB WAY, Multibanco)
- Blog/content section
- Email newsletter signup
- Order management

See [PROJECT.md](./PROJECT.md) for detailed feature roadmap.

## Development Guidelines

### Code Style
- **Components**: Functional components only
- **Typing**: TypeScript with interfaces for props
- **Imports**: ESM syntax, path aliases (`@/...`)
- **Async**: Async/await for asynchronous operations
- **Styling**: Tailwind utilities, no component CSS files

### File Naming
- Components: PascalCase (`Header.tsx`)
- Utilities: camelCase (`formatPrice.ts`)
- Types: PascalCase (`User.ts`)
- Styles: kebab-case (`brand-colors.css`)

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes, test locally
npm run dev
npx tsc --noEmit
npm run build

# Commit with clear message
git add .
git commit -m "feat: descriptive message"

# Push to remote
git push -u origin feature/your-feature-name

# Create PR on GitHub
```

**Important**: Never push directly to `main`. Always create feature branches and PRs.

## Common Commands

```bash
# Development
npm run dev           # Start development server (localhost:3000)
npm run build         # Build for production
npm start            # Run production build locally

# Type checking
npx tsc --noEmit      # Check TypeScript without emitting

# Linting
npm run lint          # Run ESLint
npm run lint -- --fix # Auto-fix linting issues

# Components (shadcn/ui)
npx shadcn-ui@latest add button    # Add a new component
npx shadcn-ui@latest add card      # Examples
```

## Documentation

### For Development
- **[CLAUDE.md](./CLAUDE.md)** - Development patterns, code style, and conventions
  - TypeScript practices
  - Component patterns
  - File organization
  - Styling approach
  - Git workflow
  - Brand aesthetic guidelines

### For Business Context
- **[PROJECT.md](./PROJECT.md)** - Business context and technical architecture
  - Brand vision and goals
  - Feature roadmap (Phases 1-4)
  - Technical decisions explained
  - Page structure and routing
  - Success metrics
  - Integration points for Phase 2+

## Testing & Quality Assurance

### TypeScript Compilation
```bash
npx tsc --noEmit
```
Must pass with no errors. Strict mode enabled to catch issues early.

### ESLint
```bash
npm run lint
```
Ensures code quality and consistency.

### Manual Testing
- Test on multiple viewport sizes (mobile, tablet, desktop)
- Test interactive components thoroughly
- Verify responsive design
- Check accessibility

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome mobile)

## Performance Optimization

This project leverages Next.js built-in optimizations:
- Automatic code splitting
- Image optimization via `next/image`
- Static generation where possible
- CSS minification via Tailwind
- Optimized production bundle

**Performance Targets:**
- Lighthouse scores: 90+ across all metrics
- First Contentful Paint: < 2 seconds
- Largest Contentful Paint: < 2.5 seconds

## Deployment

### Recommended: Vercel
```bash
# Connect GitHub repository to Vercel
# Automatic deployments on every push to main
```

Vercel is the official Next.js hosting platform with:
- Zero-config deployments
- Automatic HTTPS
- Edge Functions
- Environment variable management
- Preview deployments for PRs

### Alternative: Self-hosted
Can deploy to any Node.js hosting (AWS, DigitalOcean, Heroku, etc.)

## Resources

### Official Documentation
- [Next.js 14 Docs](https://nextjs.org/docs)
- [React 19](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

### Design References
- [brownbee.com.ar](https://brownbee.com.ar) - Brand aesthetic inspiration
- [amsterdambakingcompany.com](https://amsterdambakingcompany.com) - Modern artisanal presentation

## Contributing

See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines.

**Branch Strategy:**
- Create new branch for each feature: `feature/feature-name`
- Never reuse branches
- Write clear commit messages
- Create atomic PRs

## Support & Issues

For questions or issues:
1. Check CLAUDE.md for development guidelines
2. Check PROJECT.md for business context
3. Review existing code for patterns
4. Check Next.js and Tailwind documentation

## License

© 2024 Entremares. All rights reserved.

---

**Status**: MVP Phase - Active Development
**Version**: 0.1.0
**Last Updated**: 2024
