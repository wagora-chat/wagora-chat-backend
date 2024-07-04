-- CreateTable
CREATE TABLE "chat_room" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "color" VARCHAR(30) NOT NULL,
    "manager_id" BIGINT NOT NULL,

    CONSTRAINT "chat_room_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chat_room" ADD CONSTRAINT "chat_room_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
