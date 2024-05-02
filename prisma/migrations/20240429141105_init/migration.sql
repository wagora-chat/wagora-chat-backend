-- CreateTable
CREATE TABLE "member" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "nickname" VARCHAR(20) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "profile" VARCHAR(100) NOT NULL,

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_email_key" ON "member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "member_nickname_key" ON "member"("nickname");
