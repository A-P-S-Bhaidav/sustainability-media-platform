import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Adding enterprise-grade GIN index for blazing fast Semantic Search...");
  try {
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS media_aitags_search_idx 
      ON "Media" 
      USING GIN (to_tsvector('english', coalesce("aiTags", '')));
    `);
    console.log("✅ GIN Index created.");
  } catch (e) {
    console.log("GIN Index might already exist or failed:", e);
  }

  console.log("Creating Materialized View for instant Report metrics...");
  try {
    await prisma.$executeRawUnsafe(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS "ProjectMetrics_MV" AS
      SELECT 
        COUNT(DISTINCT "Project"."id") as "totalProjects",
        COUNT(DISTINCT "Media"."id") as "totalMedia",
        SUM(CASE WHEN "Media"."isBeforeAfter" THEN 1 ELSE 0 END) as "totalImpactPairs",
        COALESCE(SUM("Media"."bytes"), 0) as "totalBytes"
      FROM "Project"
      LEFT JOIN "Media" ON "Media"."projectId" = "Project"."id";
    `);
    
    // Also create a unique index on a dummy column or just one of the counts to allow CONCURRENTLY refresh
    // Not strictly needed for a single row view, but good practice.
    console.log("✅ Materialized View created.");
  } catch (e) {
    console.log("Materialized View might already exist or failed:", e);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
