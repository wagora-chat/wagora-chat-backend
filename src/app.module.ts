import {
    Module,
} from "@nestjs/common";
import {
    AppController,
} from "./app.controller";
import {
    ConfigModule,
} from "@nestjs/config";
import {
    AppService,
} from "./app.service";
import {
    RedisModule,
} from "@liaoliaots/nestjs-redis";
import AuthModule from "./domain/auth/auth.module";
import PrismaModule from "./prisma/prisma.module";


@Module({
    imports: [
        AuthModule,
        PrismaModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),
        RedisModule.forRoot({
            readyLog: true,
            config: {
                host: "localhost",
                port: 6379,
            },
        }),
    ],
    controllers: [AppController,],
    providers: [AppService,],
})
export class AppModule {
}
