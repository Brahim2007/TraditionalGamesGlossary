# Archival Glossary of Arab Traditional Games - Architecture Plan

## Project Overview
A UNESCO-grade digital archive for documenting and preserving Arab traditional games as intangible cultural heritage. Built with Next.js 15, PostgreSQL, and Prisma ORM.

## Core Principles
1. **Archival First**: Treat games as archival records, not blog posts
2. **Semantic Separation**: Preserve distinct metadata categories (description, rules, oral tradition, social context)
3. **Structured Data**: All content stored in normalized, queryable formats
4. **Arabic-First**: RTL layout with Arabic UI and English code comments
5. **Controlled Vocabulary**: Use UNESCO-aligned heritage classifications

## Tech Stack
- **Framework**: Next.js 15 (App Router, Server Components by default)
- **UI Library**: React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives + shadcn/ui
- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **Data Mutations**: Server Actions (no API routes unless justified)
- **Maps**: Vector-based geographic visualization

## Data Model Analysis (Extracted from JSX)

### Core Entities Identified:

#### 1. Game (Primary Entity)
- `id`: UUID
- `canonicalName`: string (Arabic)
- `localNames`: string[] (array of alternative names)
- `countryId`: string (reference to Country)
- `region`: string (geographic region within country)
- `geoCoordinates`: Json (lat/long or x/y coordinates)
- `heritageFieldId`: string (UNESCO-aligned classification)
- `gameType`: string (حركية، ذهنية، طريفة، بحرية، شعبية)
- `ageGroup`: string (الفئة العمرية)
- `practitioners`: string (نوع الممارسين)
- `playersCount`: string (عدد اللاعبين)
- `tools`: string[] (الأدوات والمستلزمات)
- `environment`: string (بيئة الممارسة)
- `timing`: string (الوقت/الموسم)
- `description`: string (الوصف الموسع - ethnographic text)
- `rules`: string[] (array of atomic rules)
- `winLossSystem`: string (نظام الفوز والخسارة)
- `startEndMechanism`: string (آلية البدء والانتهاء)
- `oralTradition`: string (الموروث الشفهي)
- `socialContext`: string (السياق الاجتماعي)
- `reviewStatus`: enum (draft, under_review, published)
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### 2. Supporting Entities:
- **Country**: Normalized country names with official Arabic designations
- **HeritageField**: UNESCO-aligned intangible heritage classifications
- **Tag**: Categorical tags for filtering (تراث خليجي، ألعاب حركية، etc.)
- **Media**: Images with captions, sources, and metadata
- **Reference**: Structured bibliographic references
- **Contributor**: Users who add/edit games
- **ReviewLog**: Audit trail for moderation workflow

## Prisma Schema Design

```prisma
// Core game entity with archival metadata
model Game {
  id                String   @id @default(cuid())
  canonicalName     String   @db.Text
  localNames        String[] // Array of alternative names
  slug              String   @unique
  
  // Geographic metadata
  countryId         String
  country           Country  @relation(fields: [countryId], references: [id])
  region            String?
  geoCoordinates    Json?    // { lat: number, lng: number } or { x: number, y: number }
  
  // Heritage classification
  heritageFieldId   String
  heritageField     HeritageField @relation(fields: [heritageFieldId], references: [id])
  
  // Game characteristics
  gameType          String   // حركية، ذهنية، طريفة، بحرية، شعبية
  ageGroup          String?
  practitioners     String?  // مختلط، ذكور، إناث
  playersCount      String?
  
  // Environment and tools
  tools             String[]
  environment       String?
  timing            String?
  
  // Descriptive content (semantically separated)
  description       String   @db.Text
  rules             String[] // Atomic rules as array
  winLossSystem     String?
  startEndMechanism String?
  oralTradition     String?
  socialContext     String?
  
  // Media and references
  media             Media[]
  references        Reference[]
  
  // Categorization
  tags              Tag[]
  
  // Workflow
  reviewStatus      ReviewStatus @default(draft)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  contributorId     String?
  contributor       Contributor? @relation(fields: [contributorId], references: [id])
  
  // Indexes
  @@index([reviewStatus])
  @@index([countryId])
  @@index([heritageFieldId])
}

// Supporting tables
model Country {
  id          String   @id @default(cuid())
  name        String   @unique // Official Arabic name
  isoCode     String?  @unique
  region      String?
  games       Game[]
}

model HeritageField {
  id          String   @id @default(cuid())
  name        String   @unique // UNESCO-aligned classification
  description String?
  games       Game[]
}

model Tag {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  games       Game[]
}

model Media {
  id          String   @id @default(cuid())
  gameId      String
  game        Game     @relation(fields: [gameId], references: [id], onDelete: Cascade)
  url         String
  caption     String?
  source      String?
  type        MediaType @default(image)
  createdAt   DateTime @default(now())
}

model Reference {
  id          String   @id @default(cuid())
  gameId      String
  game        Game     @relation(fields: [gameId], references: [id], onDelete: Cascade)
  citation    String   @db.Text
  sourceType  String?  // كتاب، دراسة، رواية شفوية
  author      String?
  year        Int?
}

model Contributor {
  id          String   @id @default(cuid())
  name        String
  email       String   @unique
  role        ContributorRole @default(editor)
  games       Game[]
  createdAt   DateTime @default(now())
}

// Enums
enum ReviewStatus {
  draft
  under_review
  published
  rejected
}

enum MediaType {
  image
  video
  audio
  document
}

enum ContributorRole {
  viewer
  editor
  reviewer
  admin
}
```

## Folder Structure

```
app/
├── (public)/
│   ├── layout.tsx           # Public layout (RTL, Arabic)
│   ├── page.tsx             # Home page
│   ├── gallery/
│   │   └── page.tsx         # Games gallery with filters
│   ├── game/
│   │   └── [slug]/
│   │       └── page.tsx     # Game detail page
│   └── about/
│       └── page.tsx         # About the project
├── (dashboard)/
│   ├── layout.tsx           # Dashboard layout
│   ├── page.tsx             # Dashboard home (stats)
│   ├── games/
│   │   ├── page.tsx         # Games management
│   │   ├── new/
│   │   │   └── page.tsx     # Add new game (multi-step)
│   │   └── [id]/
│   │       └── page.tsx     # Edit game
│   └── review/
│       └── page.tsx         # Review queue
├── api/                     # API routes (if needed)
├── lib/
│   ├── db.ts               # Prisma client
│   ├── actions/            # Server Actions
│   │   ├── game.ts         # Game CRUD operations
│   │   ├── import.ts       # Smart import logic
│   │   └── review.ts       # Review workflow
│   └── utils/
│       ├── arabic-parser.ts # Arabic text parsing
│       ├── country-normalizer.ts
│       └── validation.ts
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── public/
│   │   ├── GameCard.tsx
│   │   ├── GameDetail.tsx
│   │   ├── SearchFilters.tsx
│   │   └── VectorMap.tsx
│   ├── dashboard/
│   │   ├── StatsCards.tsx
│   │   ├── ActivityTable.tsx
│   │   ├── GameForm/
│   │   │   ├── BasicInfo.tsx
│   │   │   ├── Participants.tsx
│   │   │   ├── Gameplay.tsx
│   │   │   └── MediaSocial.tsx
│   │   └── ImportModal.tsx
│   └── shared/
│       └── LanguageToggle.tsx
└── styles/
    └── globals.css         # Tailwind + RTL overrides
```

## Key Server Actions

### 1. Game Management
```typescript
// app/lib/actions/game.ts
"use server"

export async function createGame(formData: FormData) {
  // Multi-step form processing
  // Validate archival requirements
  // Set initial reviewStatus = 'draft'
}

export async function updateGame(id: string, updates: Partial<Game>) {
  // Update with audit trail
}

export async function submitForReview(gameId: string) {
  // Change status to 'under_review'
  // Notify reviewers
}

export async function publishGame(gameId: string) {
  // Change status to 'published'
  // Update publishedAt timestamp
}
```

### 2. Smart Import System
```typescript
// app/lib/actions/import.ts
"use server"

export async function parseArabicText(text: string) {
  // Arabic field detection
  // Country name normalization (قطر → دولة قطر)
  // Rule splitting into atomic rules
  // Tag extraction from text
  // Return structured game data
}
```

### 3. Review Workflow
```typescript
// app/lib/actions/review.ts
"use server"

export async function getPendingReviews() {
  // Games with status 'under_review'
}

export async function approveGame(gameId: string, reviewerId: string) {
  // Add review log
  // Publish game
}

export async function requestRevision(gameId: string, feedback: string) {
  // Return to draft with comments
}
```

## UI Modules to Implement

### A. Public Glossary Modules
1. **Home Page**
   - Featured game spotlight
   - Quick search with Arabic autocomplete
   - Random game discovery
   - Category browsing

2. **Gallery Page**
   - Advanced filters (country, type, tags, heritage field)
   - Grid/List view toggle
   - Sort by relevance, date, name
   - Pagination

3. **Game Detail Page**
   - Archival layout (not marketing)
   - Semantic sections (Description, Rules, Social Context, etc.)
   - Media gallery with captions
   - References with proper citation format
   - Geographic visualization

4. **Vector Map Visualization**
   - Interactive map of game origins
   - Filter by region/country
   - Click to view games from location

### B. Archival Dashboard Modules
1. **Dashboard Home**
   - Statistics cards (total games, pending review, contributors)
   - Recent activity table
   - Geographic distribution chart
   - Quick actions

2. **Game Management**
   - Multi-step form (4 steps: Basic, Participants, Gameplay, Media/Social)
   - Smart import from text
   - Template system for consistent data entry
   - Draft autosave

3. **Review Workflow**
   - Queue of games awaiting review
   - Side-by-side comparison with existing data
   - One-click approve/reject with comments
   - Audit trail

## Smart Import System Features

1. **Arabic Text Parser**
   - Field name detection in Arabic
   - Context-aware parsing (knows "الدولة" means country)
   - Handles various text formats (bullet points, paragraphs, tables)

2. **Country Name Normalization**
   ```typescript
   const countryMap = {
     "قطر": "دولة قطر",
     "السعودية": "المملكة العربية السعودية",
     "الإمارات": "الإمارات العربية المتحدة",
     // ... all Arab countries
   }
   ```

3. **Rule Splitting**
   - Converts paragraphs into atomic rules array
   - Removes numbering (1., 2., •)
   - Preserves semantic meaning

4. **Preview Before Save**
   - Shows parsed data in form format
   - Allows manual corrections
   - Highlights uncertain parses

## RTL and Arabic Support

1. **Layout Configuration**
   ```typescript
   // app/layout.tsx
   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode
   }) {
     return (
       <html lang="ar" dir="rtl">
         <body className="font-ibm-plex-arabic">
           {children}
         </body>
       </html>
     )
   }
   ```

2. **Typography**
   - IBM Plex Sans Arabic font
   - Proper line heights for Arabic text
   - RTL-aware spacing

3. **Date/Number Formatting**
   - Hijri calendar support
   - Arabic numeral formatting

## Seed Data Strategy

Extract from existing JSX files (6 games):
1. الركض بالحاجبين المرفوعين (قطر)
2. الهالوسة (المنقلة) (قطر)
3. التيلة (الإمارات)
4. الحالوسة (الشامية) (العراق)
5. التوّاقيل (العراق)
6. الشَّبْحَة (الكويت)

Each game will be seeded with:
- Complete metadata from JSX
- Sample media URLs
- Reference citations
- Proper categorization

## Deployment Considerations

1. **Database**: PostgreSQL with PostGIS for geographic queries
2. **Storage**: Cloud storage for media files with Arabic filename support
3. **Search**: PostgreSQL full-text search with Arabic stemming
4. **Caching**: Redis for frequently accessed games
5. **Monitoring**: Audit logs for all archival changes

## Next Steps Implementation Order

1. **Phase 1: Foundation** (Days 1-3)
   - Set up Next.js 15 with TypeScript
   - Configure Prisma and database
   - Create core schema and seed data
   - Implement basic Server Actions

2. **Phase 2: Public Interface** (Days 4-7)
   - Build home page and gallery
   - Implement game detail page
   - Add search and filters
   - Create vector map component

3. **Phase 3: Dashboard** (Days 8-10)
   - Build dashboard layout
   - Implement multi-step game form
   - Create smart import system
   - Add review workflow

4. **Phase 4: Polish** (Days 11-12)
   - RTL and Arabic optimization
   - Performance improvements
   - Accessibility testing
   - Documentation

## Success Metrics

1. **Archival Quality**
   - 100% structured data (no flattened text blocks)
   - Semantic separation maintained
   - Proper citation formatting

2. **User Experience**
   - Arabic researchers can easily add games
   - Public users can discover games intuitively
   - Reviewers can efficiently moderate content

3. **Technical Excellence**
   - Type-safe throughout
   - Server Components by default
   - No client-side API routes
   - Proper error boundaries and loading states

This architecture creates a UNESCO-grade digital archive that balances technical modernity with archival rigor, ensuring Arab traditional games are preserved with the semantic richness they deserve.