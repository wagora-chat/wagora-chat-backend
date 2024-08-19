import {
    Module,
} from "@nestjs/common";
import {
    ChatRoomService,
} from "./chat-room.service";
import {
    ChatRoomController,
} from "./chat-room.controller";
import {
    PrismaConfig,
} from "../../prisma/prisma.config";

@Module({
    controllers: [ChatRoomController,],
    providers: [ChatRoomService,
        PrismaConfig,],
})
export class ChatRoomModule {
}
