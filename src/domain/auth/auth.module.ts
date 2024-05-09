import {
    Module,
} from "@nestjs/common";
import {
    EmailService,
} from "./service/email.service";
import {
    AuthController,
} from "./controller/auth.controller";
import AuthService from "./auth.service";
import {
    PrismaConfig,
} from "../../prisma/prisma.config";

@Module({
    imports: [],
    exports: [],
    controllers: [AuthController,],
    providers: [AuthService,
        PrismaConfig,
        EmailService,],
})
export default class AuthModule {}