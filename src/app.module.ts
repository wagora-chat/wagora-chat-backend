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

@Module({
    imports: [
        AuthModule,
        PrismaModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),
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
