# Project Structure - Archival Glossary of Arab Traditional Games

## Root Directory Structure

```
TraditionalGamesGlossary/
├── app/                          # Next.js 15 App Router
├── components/                   # React components
├── lib/                         # Utilities, database, actions
├── prisma/                      # Prisma schema and migrations
├── public/                      # Static assets
├── styles/                      # Global styles
├── types/                       # TypeScript type definitions
├── scripts/                     # Build and database scripts
├── tests/                       # Test files
├── plans/                       # Architecture documentation
├── .env.local                   # Environment variables
├── .env.example                 # Example environment variables
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
└── README.md                   # Project documentation
```

## Detailed Structure

### 1. App Router Structure (`app/`)

```
app/
├── (public)/                    # Public-facing routes
│   ├── layout.tsx              # Public layout (RTL, Arabic)
│   ├── page.tsx                # Home page
│   ├── loading.tsx             # Loading state for public routes
│   ├── error.tsx               # Error boundary for public routes
│   ├── gallery/
│   │   ├── page.tsx            # Games gallery with filters
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── game/
│   │   └── [slug]/
│   │       ├── page.tsx        # Game detail page
│   │       ├── loading.tsx
│   │       └── error.tsx
│   ├── about/
│   │   └── page.tsx            # About the project
│   └── search/
│       └── page.tsx            # Advanced search page
├── (dashboard)/                 # Admin dashboard routes
│   ├── layout.tsx              # Dashboard layout (protected)
│   ├── page.tsx                # Dashboard home (stats)
│   ├── loading.tsx
│   ├── error.tsx
│   ├── games/
│   │   ├── page.tsx            # Games management list
│   │   ├── new/
│   │   │   └── page.tsx        # Add new game (multi-step)
│   │   └── [id]/
│   │       ├── page.tsx        # Edit game
│   │       ├── loading.tsx
│   │       └── error.tsx
│   ├── review/
│   │   ├── page.tsx            # Review queue
│   │   └── [id]/
│   │       └── page.tsx        # Single review
│   ├── contributors/
│   │   └── page.tsx            # Contributors management
│   └── settings/
│       └── page.tsx            # System settings
├── api/                         # API routes (minimal, for external integrations)
│   ├── games/
│   │   └── route.ts            # GET /api/games (public API)
│   └── health/
│       └── route.ts            # Health check endpoint
├── layout.tsx                   # Root layout
├── page.tsx                     # Landing page (redirects to public)
├── loading.tsx                  # Global loading
├── error.tsx                    # Global error boundary
└── not-found.tsx                # 404 page
```

### 2. Components Structure (`components/`)

```
components/
├── ui/                          # Reusable UI components (shadcn/ui based)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── textarea.tsx
│   ├── badge.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── progress.tsx
│   ├── toast.tsx
│   └── skeleton.tsx
├── public/                      # Public-facing components
│   ├── GameCard.tsx            # Game card for gallery
│   ├── GameDetail/
│   │   ├── GameDetail.tsx      # Main detail component
│   │   ├── DescriptionSection.tsx
│   │   ├── RulesSection.tsx
│   │   ├── ParticipantsSection.tsx
│   │   ├── MediaSection.tsx
│   │   ├── ReferencesSection.tsx
│   │   └── SocialContextSection.tsx
│   ├── SearchFilters.tsx       # Advanced filter panel
│   ├── SearchBar.tsx           # Main search with autocomplete
│   ├── CategoryGrid.tsx        # Category browsing grid
│   ├── FeaturedGame.tsx        # Featured game spotlight
│   ├── VectorMap/
│   │   ├── VectorMap.tsx       # Interactive map
│   │   ├── MapMarker.tsx       # Game location marker
│   │   └── RegionOverlay.tsx   # Country/region overlays
│   └── Header/
│       ├── Header.tsx          # Public header
│       ├── Navigation.tsx      # Main navigation
│       └── LanguageToggle.tsx  # Language switcher
├── dashboard/                   # Dashboard components
│   ├── StatsCards.tsx          # Dashboard statistics cards
│   ├── ActivityTable.tsx       # Recent activity table
│   ├── ReviewQueue.tsx         # Games awaiting review
│   ├── GeographicDistribution.tsx # Distribution chart
│   ├── GameForm/               # Multi-step game form
│   │   ├── GameForm.tsx        # Main form wrapper
│   │   ├── StepIndicator.tsx   # Form step progress
│   │   ├── BasicInfoStep.tsx   # Step 1: Basic information
│   │   ├── ParticipantsStep.tsx # Step 2: Participants
│   │   ├── GameplayStep.tsx    # Step 3: Rules and gameplay
│   │   ├── MediaSocialStep.tsx # Step 4: Media and social context
│   │   └── FormPreview.tsx     # Preview before submission
│   ├── ImportModal/            # Smart import system
│   │   ├── ImportModal.tsx     # Main import modal
│   │   ├── TextParser.tsx      # Arabic text parser
│   │   ├── FieldMapper.tsx     # Field detection and mapping
│   │   ├── CountryNormalizer.tsx # Country name normalization
│   │   └── ImportPreview.tsx   # Parsed data preview
│   ├── TemplateModal/          # Data template system
│   │   ├── TemplateModal.tsx   # Template display modal
│   │   └── TemplateTable.tsx   # Field-value template table
│   └── DashboardHeader/
│       ├── DashboardHeader.tsx # Dashboard header
│       └── QuickActions.tsx    # Quick action buttons
├── shared/                      # Shared across public and dashboard
│   ├── Layout/
│   │   ├── Container.tsx       # Responsive container
│   │   ├── Grid.tsx            # Custom grid component
│   │   └── Section.tsx         # Content section wrapper
│   ├── Media/
│   │   ├── ImageWithFallback.tsx # Image with error handling
│   │   ├── MediaGallery.tsx    # Image/video gallery
│   │   └── Caption.tsx         # Media caption component
│   ├── Tags/
│   │   ├── Tag.tsx             # Individual tag
│   │   ├── TagList.tsx         # List of tags
│   │   └── TagCloud.tsx        # Interactive tag cloud
│   ├── Filters/
│   │   ├── FilterGroup.tsx     # Filter category group
│   │   ├── CountryFilter.tsx   # Country selector
│   │   ├── TypeFilter.tsx      # Game type selector
│   │   └── HeritageFieldFilter.tsx # Heritage field selector
│   └── Navigation/
│       ├── Breadcrumbs.tsx     # Breadcrumb navigation
│       ├── Pagination.tsx      # Pagination controls
│       └── BackButton.tsx      # Back navigation button
└── providers/                   # Context providers
    ├── ThemeProvider.tsx       # Theme context
    ├── LanguageProvider.tsx    # Language context (Arabic/English)
    └── AuthProvider.tsx        # Authentication context
```

### 3. Library Structure (`lib/`)

```
lib/
├── db.ts                       # Prisma client instance
├── actions/                    # Server Actions
│   ├── game/
│   │   ├── create.ts          # Create new game
│   │   ├── update.ts          # Update existing game
│   │   ├── delete.ts          # Delete game (soft/hard)
│   │   ├── publish.ts         # Publish game
│   │   ├── submit-review.ts   # Submit for review
│   │   └── search.ts          # Search games
│   ├── import/
│   │   ├── parse-text.ts      # Parse Arabic text
│   │   ├── normalize-country.ts # Country name normalization
│   │   ├── extract-rules.ts   # Extract atomic rules from text
│   │   └── validate-import.ts # Validate imported data
│   ├── review/
│   │   ├── get-pending.ts     # Get pending reviews
│   │   ├── approve.ts         # Approve game
│   │   ├── reject.ts          # Reject with feedback
│   │   └── request-revision.ts # Request revisions
│   ├── media/
│   │   ├── upload.ts          # Upload media files
│   │   ├── delete.ts          # Delete media
│   │   └── validate.ts        # Validate media files
│   └── auth/
│       ├── sign-in.ts         # Sign in
│       ├── sign-out.ts        # Sign out
│       └── get-session.ts     # Get current session
├── utils/                      # Utility functions
│   ├── arabic/
│   │   ├── parser.ts          # Arabic text parsing utilities
│   │   ├── normalizer.ts      # Arabic text normalization
│   │   ├── stemmer.ts         # Arabic word stemming
│   │   └── transliterator.ts  # Arabic transliteration
│   ├── validation/
│   │   ├── game-schema.ts     # Game data validation schema
│   │   ├── import-schema.ts   # Import data validation
│   │   └── media-schema.ts    # Media validation
│   ├── formatting/
│   │   ├── date.ts            # Date formatting (Hijri/Gregorian)
│   │   ├── text.ts            # Text formatting utilities
│   │   └── citation.ts        # Citation formatting
│   ├── geography/
│   │   ├── coordinates.ts     # Coordinate utilities
│   │   ├── countries.ts       # Country data and mappings
│   │   └── regions.ts         # Arab region definitions
│   └── performance/
│       ├── debounce.ts        # Debounce function
│       ├── throttle.ts        # Throttle function
│       └── cache.ts           # Simple caching utilities
├── constants/                  # Application constants
│   ├── countries.ts           # Arab country data
│   ├── heritage-fields.ts     # UNESCO heritage classifications
│   ├── game-types.ts          # Game type definitions
│   ├── age-groups.ts          # Age group categories
│   ├── tags.ts                # Predefined tags
│   └── routes.ts              # Application routes
└── middleware/                 # Edge middleware
    ├── auth.ts                # Authentication middleware
    ├── rtl.ts                 # RTL layout middleware
    └── cache.ts               # Cache control middleware
```

### 4. Prisma Structure (`prisma/`)

```
prisma/
├── schema.prisma              # Main Prisma schema
├── migrations/                # Database migrations
│   ├── 2025012801_init/      # Initial schema
│   ├── 2025012802_seed/      # Seed data migration
│   └── 2025012803_indexes/   # Performance indexes
├── seeds/                     # Seed data scripts
│   ├── countries.ts          # Arab countries seed
│   ├── heritage-fields.ts    # Heritage fields seed
│   ├── tags.ts               # Tags seed
│   ├── games.ts              # Games from JSX files
│   └── contributors.ts       # Sample contributors
└── scripts/                  # Database scripts
    ├── reset-db.ts           # Reset database
    ├── seed-db.ts            # Seed database
    └── backup-db.ts          # Backup database
```

### 5. Public Assets (`public/`)

```
public/
├── images/                    # Static images
│   ├── logo.svg              # Application logo
│   ├── favicon.ico           # Favicon
│   ├── placeholder/          # Placeholder images
│   │   ├── game-default.jpg
│   │   └── avatar-default.png
│   └── maps/                 # Map assets
│       ├── arab-world.svg    # Arab world vector map
│       └── regions/          # Regional maps
├── fonts/                    # Custom fonts
│   ├── ibm-plex-sans-arabic/ # IBM Plex Sans Arabic
│   └── noto-sans-arabic/     # Noto Sans Arabic (fallback)
└── locales/                  # Localization files
    ├── ar/                   # Arabic translations
    │   ├── common.json
    │   ├── games.json
    │   └── dashboard.json
    └── en/                   # English translations
        ├── common.json
        ├── games.json
        └── dashboard.json
```

### 6. Styles (`styles/`)

```
styles/
├── globals.css               # Global styles
├── rtl.css                   # RTL-specific styles
├── fonts.css                 # Font face definitions
├── components/               # Component-specific styles
│   ├── game-card.css
│   ├── game-detail.css
│   ├── dashboard.css
│   └── forms.css
└── themes/                   # Theme definitions
    ├── light.css             # Light theme
    ├── dark.css              # Dark theme
    └── archival.css          # Archival theme (green/gold)
```

### 7. Types (`types/`)

```
types/
├── database.ts               # Database type definitions
├── api.ts                    # API type definitions
├── game.ts                   # Game-related types
├── import.ts                 # Import-related types
├── media.ts                  # Media-related types
├── user.ts                   # User/contributor types
└── index.ts                  # Re-exports
```

### 8. Configuration Files

```
# Root level configuration files
.next/                        # Next.js build output (gitignored)
node_modules/                 # Dependencies (gitignored)

# Configuration files
.env.local                    # Local environment variables
.env.example                  # Example environment variables
.env.production               # Production environment variables

next.config.ts               # Next.js configuration
tailwind.config.ts           # Tailwind CSS configuration
postcss.config.js            # PostCSS configuration
tsconfig.json               # TypeScript configuration
.eslintrc.json              # ESLint configuration
.prettierrc                 # Prettier configuration
.gitignore                  # Git ignore file
```

## Key Implementation Notes

### 1. App Router Conventions
- Use Server Components by default
- Client Components only when necessary (interactivity, browser APIs)
- Route groups `(public)` and `(dashboard)` for logical separation
- Loading and error boundaries for each route segment

### 2. Component Organization
- `ui/`: Reusable, unstyled primitives (headless)
- Feature-specific components in their domain folders
- Shared components used across features
- Providers for global state management

### 3. Server Actions Pattern
- All data mutations via Server Actions (no API routes)
- Actions organized by domain (game, import, review, etc.)
- Proper validation and error handling
- Authentication and authorization checks

### 4. Type Safety
- Full TypeScript strict mode
- Generated Prisma types for database
- Shared type definitions in `types/`
- Runtime validation with Zod schemas

### 5. RTL Support
- `dir="rtl"` on html element
- RTL-aware Tailwind classes
- Arabic font stack
- Hijri date formatting

### 6. Performance Considerations
- Image optimization with Next.js Image
- Code splitting with dynamic imports
- Database query optimization
- Caching strategy for frequently accessed data

## Initial Setup Commands

```bash
# Create Next.js 15 app with TypeScript and Tailwind
npx create-next-app@latest TraditionalGamesGlossary --typescript --tailwind --app --no-eslint

# Install dependencies
npm install prisma @prisma/client
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs
npm install zod react-hook-form @hookform/resolvers
npm install lucide-react
npm install date-fns date-fns-hijri
npm install @types/node @types/react @types/react-dom --save-dev

# Initialize Prisma
npx prisma init
npx prisma db push
npx prisma generate

# Set up shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card dialog input select textarea badge table tabs
```

This structure provides a scalable, maintainable foundation for a UNESCO-grade digital archive while adhering to modern Next.js 15 best practices and the specific requirements of Arabic traditional games documentation.