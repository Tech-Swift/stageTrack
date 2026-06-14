-- CreateTable
CREATE TABLE "RolePolicy" (
    "id" TEXT NOT NULL,
    "actorRole" "UserRole" NOT NULL,
    "fromRole" "UserRole" NOT NULL,
    "toRole" "UserRole" NOT NULL,
    "action" TEXT NOT NULL DEFAULT 'ROLE_CHANGE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePolicy_pkey" PRIMARY KEY ("id")
);
