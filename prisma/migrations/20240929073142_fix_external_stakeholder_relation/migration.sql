-- CreateTable
CREATE TABLE "ExternalStakeholder" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),

    CONSTRAINT "ExternalStakeholder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalJobStakeholder" (
    "jobId" INTEGER NOT NULL,
    "externalStakeholderId" INTEGER NOT NULL,

    CONSTRAINT "ExternalJobStakeholder_pkey" PRIMARY KEY ("jobId","externalStakeholderId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExternalStakeholder_email_key" ON "ExternalStakeholder"("email");

-- AddForeignKey
ALTER TABLE "ExternalJobStakeholder" ADD CONSTRAINT "ExternalJobStakeholder_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalJobStakeholder" ADD CONSTRAINT "ExternalJobStakeholder_externalStakeholderId_fkey" FOREIGN KEY ("externalStakeholderId") REFERENCES "ExternalStakeholder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
