-- Performance Enhancement Migration
-- إضافة فهارس للبحث بالنص الكامل والأداء العام
-- Created: 2026-02-01

-- ==================== FULL TEXT SEARCH INDEXES ====================

-- فهرس البحث بالنص الكامل للألعاب (عربي)
-- Full-text search index for games (Arabic)
CREATE INDEX IF NOT EXISTS idx_game_search_arabic 
ON "Game" 
USING GIN(to_tsvector('arabic', 
  COALESCE("canonicalName", '') || ' ' || 
  COALESCE("description", '') || ' ' || 
  COALESCE("region", '') || ' ' ||
  COALESCE("oralTradition", '') || ' ' ||
  COALESCE("socialContext", '')
));

-- فهرس البحث بالنص الكامل (إنجليزي) للأسماء الإنجليزية
-- Full-text search index for English names
CREATE INDEX IF NOT EXISTS idx_game_search_english 
ON "Game" 
USING GIN(to_tsvector('english', 
  COALESCE("englishName", '') || ' ' || 
  COALESCE("description", '')
));

-- فهرس للبحث في الأسماء المحلية (Array)
-- Index for searching local names array
CREATE INDEX IF NOT EXISTS idx_game_local_names 
ON "Game" 
USING GIN("localNames");

-- فهرس للبحث في الأدوات (Array)
-- Index for searching tools array
CREATE INDEX IF NOT EXISTS idx_game_tools 
ON "Game" 
USING GIN("tools");

-- فهرس للبحث في القواعد (Array)
-- Index for searching rules array
CREATE INDEX IF NOT EXISTS idx_game_rules 
ON "Game" 
USING GIN("rules");

-- ==================== COMPOSITE INDEXES FOR COMMON QUERIES ====================

-- فهرس مركب للبحث حسب الحالة والتاريخ
-- Composite index for status and date queries
CREATE INDEX IF NOT EXISTS idx_game_status_date 
ON "Game" ("reviewStatus", "createdAt" DESC);

-- فهرس مركب للبحث حسب الدولة والحالة
-- Composite index for country and status queries
CREATE INDEX IF NOT EXISTS idx_game_country_status 
ON "Game" ("countryId", "reviewStatus");

-- فهرس مركب للبحث حسب المجال التراثي والحالة
-- Composite index for heritage field and status queries
CREATE INDEX IF NOT EXISTS idx_game_heritage_status 
ON "Game" ("heritageFieldId", "reviewStatus");

-- فهرس مركب للألعاب المنشورة حسب التاريخ
-- Composite index for published games by date
CREATE INDEX IF NOT EXISTS idx_game_published_date 
ON "Game" ("publishedAt" DESC) 
WHERE "reviewStatus" = 'published';

-- ==================== SIMILARITY SEARCH OPTIMIZATION ====================

-- فهرس مركب لاستعلامات التشابه
-- Composite index for similarity queries
CREATE INDEX IF NOT EXISTS idx_similarity_score_status 
ON "GameSimilarity" ("overallScore" DESC, "status");

-- فهرس للتشابه حسب الحالة والتاريخ
-- Index for similarity by status and date
CREATE INDEX IF NOT EXISTS idx_similarity_status_date 
ON "GameSimilarity" ("status", "calculatedAt" DESC);

-- فهرس للتشابه عالي الدرجة
-- Index for high-score similarities
CREATE INDEX IF NOT EXISTS idx_similarity_high_score 
ON "GameSimilarity" ("overallScore" DESC) 
WHERE "overallScore" >= 0.75;

-- ==================== CONTRIBUTOR & AUDIT INDEXES ====================

-- فهرس للمساهمين حسب الدور والنشاط
-- Index for contributors by role and activity
CREATE INDEX IF NOT EXISTS idx_contributor_role_active 
ON "Contributor" ("role", "lastActive" DESC NULLS LAST);

-- فهرس لسجلات المراجعة حسب اللعبة والتاريخ
-- Index for review logs by game and date
CREATE INDEX IF NOT EXISTS idx_review_log_game_date 
ON "ReviewLog" ("gameId", "createdAt" DESC);

-- فهرس لسجلات النظام حسب النوع والتاريخ
-- Index for system logs by type and date
CREATE INDEX IF NOT EXISTS idx_system_log_type_date 
ON "SystemLog" ("entityType", "createdAt" DESC);

-- ==================== MEDIA & REFERENCES OPTIMIZATION ====================

-- فهرس للوسائط حسب اللعبة والنوع
-- Index for media by game and type
CREATE INDEX IF NOT EXISTS idx_media_game_type 
ON "Media" ("gameId", "type");

-- فهرس للمراجع حسب اللعبة ونوع المصدر
-- Index for references by game and source type
CREATE INDEX IF NOT EXISTS idx_reference_game_source 
ON "Reference" ("gameId", "sourceType");

-- ==================== SESSION & SECURITY INDEXES ====================

-- فهرس للجلسات النشطة
-- Index for active sessions
CREATE INDEX IF NOT EXISTS idx_session_active 
ON "Session" ("expiresAt" DESC);

-- فهرس للجلسات حسب المساهم
-- Index for sessions by contributor
CREATE INDEX IF NOT EXISTS idx_session_contributor_active 
ON "Session" ("contributorId", "expiresAt" DESC);

-- ==================== CONCEPT & TAG OPTIMIZATION ====================

-- فهرس للمفاهيم حسب تاريخ الإنشاء
-- Index for concepts by creation date
CREATE INDEX IF NOT EXISTS idx_concept_created 
ON "GameConcept" ("createdAt" DESC);

-- فهرس للوسوم حسب الفئة
-- Index for tags by category
CREATE INDEX IF NOT EXISTS idx_tag_category 
ON "Tag" ("category", "name");

-- فهرس لربط اللعبة بالوسوم
-- Index for game-tag junction
CREATE INDEX IF NOT EXISTS idx_game_tag_game 
ON "GameTag" ("gameId");

CREATE INDEX IF NOT EXISTS idx_game_tag_tag 
ON "GameTag" ("tagId");

-- ==================== GEOGRAPHIC OPTIMIZATION ====================

-- فهرس للدول حسب المنطقة
-- Index for countries by region
CREATE INDEX IF NOT EXISTS idx_country_region 
ON "Country" ("region");

-- فهرس للإحداثيات الجغرافية (JSON)
-- Index for geographic coordinates (JSON)
CREATE INDEX IF NOT EXISTS idx_game_geo_coordinates 
ON "Game" USING GIN("geoCoordinates");

-- ==================== STATISTICS & ANALYTICS ====================

-- إنشاء دالة لحساب إحصائيات الألعاب
-- Create function for game statistics
CREATE OR REPLACE FUNCTION get_game_statistics()
RETURNS TABLE (
  total_games BIGINT,
  published_games BIGINT,
  draft_games BIGINT,
  under_review_games BIGINT,
  total_countries BIGINT,
  total_concepts BIGINT,
  pending_similarities BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) FILTER (WHERE TRUE),
    COUNT(*) FILTER (WHERE "reviewStatus" = 'published'),
    COUNT(*) FILTER (WHERE "reviewStatus" = 'draft'),
    COUNT(*) FILTER (WHERE "reviewStatus" = 'under_review'),
    (SELECT COUNT(DISTINCT "countryId") FROM "Game"),
    (SELECT COUNT(*) FROM "GameConcept"),
    (SELECT COUNT(*) FROM "GameSimilarity" WHERE "status" = 'pending')
  FROM "Game";
END;
$$ LANGUAGE plpgsql;

-- ==================== MAINTENANCE ====================

-- إعادة بناء الفهارس (يُنفذ دورياً)
-- Rebuild indexes (run periodically)
-- REINDEX DATABASE CONCURRENTLY;

-- تحليل الجداول لتحديث الإحصائيات
-- Analyze tables to update statistics
ANALYZE "Game";
ANALYZE "GameSimilarity";
ANALYZE "Contributor";
ANALYZE "Media";
ANALYZE "Reference";
ANALYZE "ReviewLog";
ANALYZE "SystemLog";

-- ==================== COMMENTS ====================

COMMENT ON INDEX idx_game_search_arabic IS 'فهرس البحث بالنص الكامل للألعاب باللغة العربية';
COMMENT ON INDEX idx_game_search_english IS 'فهرس البحث بالنص الكامل للأسماء الإنجليزية';
COMMENT ON INDEX idx_similarity_high_score IS 'فهرس للتشابهات عالية الدرجة (>= 75%)';
COMMENT ON FUNCTION get_game_statistics IS 'دالة لحساب إحصائيات الألعاب والمحتوى';
