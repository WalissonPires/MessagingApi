-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "mimeType" VARCHAR(50) NOT NULL,
    "hash" VARCHAR(32) NOT NULL,
    "size" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountFile" (
    "accountId" INTEGER NOT NULL,
    "fileId" INTEGER NOT NULL,

    CONSTRAINT "AccountFile_pkey" PRIMARY KEY ("accountId","fileId")
);

-- AddForeignKey
ALTER TABLE "AccountFile" ADD CONSTRAINT "AccountFile_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountFile" ADD CONSTRAINT "AccountFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
