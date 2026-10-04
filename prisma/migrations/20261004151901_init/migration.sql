-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('CONCEPT', 'PRACTICE', 'PROJECT');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('VIDEO', 'ARTICLE', 'COURSE', 'BOOK', 'DOCS', 'TOOL');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "color" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "title" JSONB NOT NULL,
    "summary" JSONB NOT NULL,
    "problem" JSONB NOT NULL,
    "solution" JSONB NOT NULL,
    "aiRole" JSONB NOT NULL,
    "impact" JSONB NOT NULL,
    "metrics" JSONB,
    "countryCode" TEXT NOT NULL,
    "region" TEXT,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "year" INTEGER,
    "sdgs" INTEGER[],
    "technologies" TEXT[],
    "coverImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseSource" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "publisher" TEXT,
    "url" TEXT NOT NULL,
    "accessedAt" TIMESTAMP(3),

    CONSTRAINT "CaseSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB,
    "category" TEXT,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "provider" TEXT,
    "lang" TEXT NOT NULL DEFAULT 'en',
    "free" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Path" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "domainId" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "level" "Level" NOT NULL DEFAULT 'BEGINNER',
    "title" JSONB NOT NULL,
    "description" JSONB NOT NULL,
    "estimatedHours" INTEGER,
    "coverImage" TEXT,

    CONSTRAINT "Path_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathNode" (
    "id" TEXT NOT NULL,
    "pathId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "type" "NodeType" NOT NULL DEFAULT 'CONCEPT',
    "order" INTEGER NOT NULL,
    "posX" DOUBLE PRECISION,
    "posY" DOUBLE PRECISION,
    "estimatedHours" INTEGER,
    "task" JSONB,

    CONSTRAINT "PathNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathEdge" (
    "id" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,

    CONSTRAINT "PathEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CasePath" (
    "caseId" TEXT NOT NULL,
    "pathId" TEXT NOT NULL,
    "relevance" INTEGER NOT NULL DEFAULT 1,
    "note" JSONB,

    CONSTRAINT "CasePath_pkey" PRIMARY KEY ("caseId","pathId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_slug_key" ON "Domain"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Case_slug_key" ON "Case"("slug");

-- CreateIndex
CREATE INDEX "Case_status_domainId_idx" ON "Case"("status", "domainId");

-- CreateIndex
CREATE INDEX "Case_countryCode_idx" ON "Case"("countryCode");

-- CreateIndex
CREATE INDEX "Case_sdgs_idx" ON "Case" USING GIN ("sdgs");

-- CreateIndex
CREATE INDEX "Case_technologies_idx" ON "Case" USING GIN ("technologies");

-- CreateIndex
CREATE INDEX "CaseSource_caseId_idx" ON "CaseSource"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_slug_key" ON "Skill"("slug");

-- CreateIndex
CREATE INDEX "Resource_skillId_idx" ON "Resource"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "Path_slug_key" ON "Path"("slug");

-- CreateIndex
CREATE INDEX "Path_status_idx" ON "Path"("status");

-- CreateIndex
CREATE INDEX "PathNode_pathId_order_idx" ON "PathNode"("pathId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "PathNode_pathId_skillId_key" ON "PathNode"("pathId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "PathEdge_fromId_toId_key" ON "PathEdge"("fromId", "toId");

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseSource" ADD CONSTRAINT "CaseSource_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Path" ADD CONSTRAINT "Path_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathNode" ADD CONSTRAINT "PathNode_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "Path"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathNode" ADD CONSTRAINT "PathNode_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathEdge" ADD CONSTRAINT "PathEdge_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "PathNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathEdge" ADD CONSTRAINT "PathEdge_toId_fkey" FOREIGN KEY ("toId") REFERENCES "PathNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CasePath" ADD CONSTRAINT "CasePath_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CasePath" ADD CONSTRAINT "CasePath_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "Path"("id") ON DELETE CASCADE ON UPDATE CASCADE;
