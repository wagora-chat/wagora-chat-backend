import {
    Module,
} from "@nestjs/common";
import {
    PrismaConfig,
} from "../../prisma/prisma.config";
import MemberService from "./member.service";
import MemberController from "./member.controller";

@Module({
    controllers: [MemberController,],
    providers: [MemberService,
        PrismaConfig,],
})
export default class MemberModule {}