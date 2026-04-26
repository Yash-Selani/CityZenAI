-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateTable
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "aiDraft" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "coords" geometry(Point, 4326),
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "city" TEXT NOT NULL,
    "authorityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Authority" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "department" TEXT,
    "jurisdiction" geometry(Polygon, 4326),

    CONSTRAINT "Authority_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "complaint_coords_idx" ON "Complaint" USING GIST ("coords");

-- CreateIndex
CREATE INDEX "Complaint_status_idx" ON "Complaint"("status");

-- CreateIndex
CREATE INDEX "Complaint_category_idx" ON "Complaint"("category");

-- CreateIndex
CREATE INDEX "Complaint_city_idx" ON "Complaint"("city");

-- CreateIndex
CREATE INDEX "Authority_city_idx" ON "Authority"("city");

-- CreateIndex
CREATE INDEX "authority_jurisdiction_idx" ON "Authority" USING GIST ("jurisdiction");

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_authorityId_fkey" FOREIGN KEY ("authorityId") REFERENCES "Authority"("id") ON DELETE SET NULL ON UPDATE CASCADE;
