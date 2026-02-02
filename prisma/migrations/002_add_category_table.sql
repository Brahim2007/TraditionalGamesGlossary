-- Migration: Add Category table for homepage browsing
-- This allows categories to be managed from the dashboard

CREATE TABLE IF NOT EXISTS "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT NOT NULL DEFAULT 'LayoutGrid',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug");

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "Category_order_idx" ON "Category"("order");
CREATE INDEX IF NOT EXISTS "Category_isActive_idx" ON "Category"("isActive");

-- Insert default categories
INSERT INTO "Category" ("id", "name", "slug", "description", "icon", "order", "isActive", "color")
VALUES 
    (gen_random_uuid()::text, 'الكل', 'all', 'عرض جميع الألعاب', 'LayoutGrid', 0, true, '#3B7C5F'),
    (gen_random_uuid()::text, 'ألعاب حركية', 'physical-games', 'ألعاب تعتمد على الحركة والنشاط البدني', 'Activity', 1, true, '#10B981'),
    (gen_random_uuid()::text, 'ألعاب ذهنية', 'mental-games', 'ألعاب تعتمد على التفكير والذكاء', 'Brain', 2, true, '#8B5CF6'),
    (gen_random_uuid()::text, 'تراث خليجي', 'gulf-heritage', 'ألعاب من التراث الخليجي', 'Award', 3, true, '#F59E0B'),
    (gen_random_uuid()::text, 'ألعاب بحرية', 'sea-games', 'ألعاب مرتبطة بالبحر والساحل', 'Anchor', 4, true, '#3B82F6'),
    (gen_random_uuid()::text, 'تراث عراقي', 'iraqi-heritage', 'ألعاب من التراث العراقي', 'ScrollText', 5, true, '#DC2626'),
    (gen_random_uuid()::text, 'ألعاب طريفة', 'fun-games', 'ألعاب مسلية وطريفة', 'Smile', 6, true, '#EC4899')
ON CONFLICT (name) DO NOTHING;

-- Add comment to table
COMMENT ON TABLE "Category" IS 'Categories for browsing games on homepage - manageable from dashboard';
