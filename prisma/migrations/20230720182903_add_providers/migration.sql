-- CreateTable
CREATE TABLE "Provider" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "config" VARCHAR(5000) NOT NULL,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
