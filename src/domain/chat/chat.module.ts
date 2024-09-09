import {
    Module,
} from "@nestjs/common";
import ChatGateway from "./chat.gateway";
import AuthModule from "../auth/auth.module";
import {
    JwtModule,
} from "@nestjs/jwt";
import PrismaModule from "../../prisma/prisma.module";
import ChatService from "./chat.service";

@Module({
    imports: [AuthModule,
        PrismaModule,
        JwtModule,],
    providers: [ChatGateway,
        ChatService,],
})
export default class ChatModule {}