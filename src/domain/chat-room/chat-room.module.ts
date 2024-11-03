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
import {
    FileModule,
} from "../file/file.module";

@Module({
    imports: [
        FileModule,
    ],
    controllers: [ChatRoomController,],
    providers: [
        ChatRoomService,
        PrismaConfig,
    ],
})
export class ChatRoomModule {
}
