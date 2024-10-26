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
import {
    JwtModule,
} from "@nestjs/jwt";
import {
    JwtStrategy,
} from "./strategies/jwt.strategy";

@Module({
    imports: [
        JwtModule.register({
            signOptions: {
                expiresIn: "1h",
            },
        }),
    ],
    exports: [],
    controllers: [AuthController,],
    providers: [
        AuthService,
        PrismaConfig,
        EmailService,
        JwtStrategy,
    ],
})
export default class AuthModule {
}