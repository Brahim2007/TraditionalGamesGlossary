// Type definitions for Traditional Games Glossary

// Game status enum
export type ReviewStatus = 'draft' | 'under_review' | 'published' | 'rejected' | 'archived'

// Media types
export type MediaType = 'image' | 'video' | 'audio' | 'document'

// Contributor roles
export type ContributorRole = 'viewer' | 'editor' | 'reviewer' | 'admin'

// Review actions
export type ReviewAction =
  | 'created'
  | 'updated'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'archived'

// Geographic coordinates
export interface GeoCoordinates {
  lat?: number
  lng?: number
  x?: number
  y?: number
}

// Base Game interface (matching Prisma schema)
export interface Game {
  id: string
  canonicalName: string
  localNames: string[]
  slug: string
  countryId: string
  region?: string | null
  geoCoordinates?: GeoCoordinates | null
  heritageFieldId: string
  gameType: string
  ageGroup?: string | null
  practitioners?: string | null
  playersCount?: string | null
  tools: string[]
  environment?: string | null
  timing?: string | null
  description: string
  rules: string[]
  winLossSystem?: string | null
  startEndMechanism?: string | null
  oralTradition?: string | null
  socialContext?: string | null
  // Ethno-cognitive archival fields (حقول الأرشفة الإثنو-معرفية)
  ethnographicMeaning?: string | null
  linguisticOrigin?: string | null
  cognitiveComplexity?: string | null
  folkCognitiveFunction?: string | null
  reviewStatus: ReviewStatus
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date | null
  contributorId?: string | null
  reviewerId?: string | null
  reviewNotes?: string | null
}

// Game with relations (for detail views)
export interface GameWithRelations extends Game {
  country: Country
  heritageField: HeritageField
  tags: TagRelation[]
  media: Media[]
  references: Reference[]
  contributor?: ContributorBasic | null
}

// Country interface
export interface Country {
  id: string
  name: string
  isoCode?: string | null
  region?: string | null
  description?: string | null
}

// Heritage field interface
export interface HeritageField {
  id: string
  name: string
  description?: string | null
  category?: string | null
}

// Tag interface
export interface Tag {
  id: string
  name: string
  description?: string | null
  category?: string | null
}

// Tag relation (game-tag junction)
export interface TagRelation {
  id: string
  gameId: string
  tagId: string
  tag: Tag
}

// Media interface
export interface Media {
  id: string
  gameId: string
  url: string
  caption?: string | null
  source?: string | null
  type: MediaType
  width?: number | null
  height?: number | null
  createdAt: Date
}

// Reference interface
export interface Reference {
  id: string
  gameId: string
  citation: string
  sourceType?: string | null
  author?: string | null
  year?: number | null
  publisher?: string | null
  url?: string | null
}

// Contributor (basic info for public display)
export interface ContributorBasic {
  name: string
  institution?: string | null
}

// Contributor (full info)
export interface Contributor {
  id: string
  name: string
  email: string
  role: ContributorRole
  avatarUrl?: string | null
  bio?: string | null
  institution?: string | null
  countryId?: string | null
  createdAt: Date
  lastActive?: Date | null
}

// Review log interface
export interface ReviewLog {
  id: string
  gameId: string
  reviewerId: string
  action: ReviewAction
  notes?: string | null
  changes?: Record<string, unknown> | null
  createdAt: Date
  game?: { canonicalName: string; slug: string }
  reviewer?: { name: string }
}

// Dashboard statistics
export interface DashboardStats {
  totalGames: number
  pendingReview: number
  publishedGames: number
  contributors: number
}

// Form data for creating/updating games
export interface GameFormData {
  canonicalName: string
  localNames: string
  countryId: string
  region: string
  heritageFieldId: string
  tags: string
  description: string
  ageGroup: string
  ageGroupDetails: string
  practitioners: string
  practitionersDetails: string
  playersCount: string
  playersDetails: string
  tools: string
  environment: string
  timing: string
  rules: string[]
  winLossSystem: string
  startEndMechanism: string
  oralTradition: string
  socialContext: string
  // Ethno-cognitive archival fields (حقول الأرشفة الإثنو-معرفية)
  ethnographicMeaning: string
  linguisticOrigin: string
  cognitiveComplexity: string
  folkCognitiveFunction: string
  references: string
}

// Smart import parsed data
export interface ParsedImportData {
  name?: string
  localNames?: string
  country?: string
  region?: string
  heritageField?: string
  tags?: string
  description?: string
  ageGroup?: string
  ageGroupDetails?: string
  practitioners?: string
  practitionersDetails?: string
  playersCount?: string
  playersDetails?: string
  tools?: string
  environment?: string
  timing?: string
  rules?: string[]
  winLossSystem?: string
  startEndMechanism?: string
  oralTradition?: string
  socialContext?: string
  // Ethno-cognitive archival fields (حقول الأرشفة الإثنو-معرفية)
  ethnographicMeaning?: string
  linguisticOrigin?: string
  cognitiveComplexity?: string
  folkCognitiveFunction?: string
  references?: string
  imageUrl?: string
  imageCaption?: string
}

// API response types
export interface ActionResult<T = void> {
  success: boolean
  message?: string
  data?: T
  errors?: { field: string; message: string }[]
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
