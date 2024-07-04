-- CreateTable
CREATE TABLE "member_room" (
    "room_id" BIGINT NOT NULL,
    "member_id" BIGINT NOT NULL,

    CONSTRAINT "member_room_pkey" PRIMARY KEY ("room_id","member_id")
);

-- AddForeignKey
ALTER TABLE "member_room" ADD CONSTRAINT "member_room_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_room" ADD CONSTRAINT "member_room_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "chat_room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
