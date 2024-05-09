import {
    Module,
} from "@nestjs/common";
import AuthService from "./auth.service";
import {
    PrismaConfig,
} from "../../prisma/prisma.config";
import AuthController from "./auth.controller";

@Module({
    controllers: [AuthController,],
    providers: [AuthService,
        PrismaConfig,],
})
export default class AuthModule {}