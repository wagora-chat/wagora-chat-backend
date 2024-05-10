import {
    Module,
} from "@nestjs/common";
import {
    EmailService,
} from "./email.service";
import AuthService from "./auth.service";
import {
    PrismaConfig,
} from "../../prisma/prisma.config";
import AuthController from "./auth.controller";

@Module({
    imports: [],
    exports: [],
    controllers: [AuthController,],
    providers: [AuthService,
        PrismaConfig,
        EmailService,],
})
export default class AuthModule {}