import {
    Module,
} from "@nestjs/common";
import {
    AppController,
} from "./app.controller";
import {
    ConfigModule, ConfigService,
} from "@nestjs/config";
import {
    AppService,
} from "./app.service";
import {
    RedisModule,
} from "@liaoliaots/nestjs-redis";
import AuthModule from "./domain/auth/auth.module";
import PrismaModule from "./prisma/prisma.module";
import {
    FileModule,
} from "./domain/file/file.module";
import {
    S3Module,
} from "./s3/s3.module";
import {
    ChatRoomModule,
} from "./domain/chat-room/chat-room.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),
        FileModule,
        S3Module,
        AuthModule,
        PrismaModule,
        ChatRoomModule,
        RedisModule.forRootAsync(
            {
                imports: [ConfigModule,],
                inject: [ConfigService,],
                useFactory: (configService: ConfigService) => ({
                    readyLog: true,
                    config: {
                        port: configService.get<number>("REDIS_PORT"),
                        host: configService.get<string>("REDIS_HOST"),
                    },
                }),
            }
        ),
    ],
    controllers: [AppController,],
    providers: [AppService,],
})
export class AppModule {
}
