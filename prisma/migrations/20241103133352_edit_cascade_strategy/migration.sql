-- DropForeignKey
ALTER TABLE "room_file" DROP CONSTRAINT "room_file_file_id_fkey";

-- DropForeignKey
ALTER TABLE "room_file" DROP CONSTRAINT "room_file_room_id_fkey";

-- AddForeignKey
ALTER TABLE "room_file" ADD CONSTRAINT "room_file_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_file" ADD CONSTRAINT "room_file_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "chat_room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
