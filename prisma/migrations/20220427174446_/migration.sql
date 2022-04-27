-- CreateTable
CREATE TABLE "Depth" (
    "id" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "players" TEXT[],

    CONSTRAINT "Depth_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Depth" ADD CONSTRAINT "Depth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
