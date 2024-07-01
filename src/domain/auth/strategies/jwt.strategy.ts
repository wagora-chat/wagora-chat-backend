import {
    Injectable, UnauthorizedException,
} from "@nestjs/common";
import {
    ExtractJwt,
    Strategy,
} from "passport-jwt";
import {
    PassportStrategy,
} from "@nestjs/passport";
import {
    ConfigService,
} from "@nestjs/config";
import {
    PrismaConfig,
} from "../../../prisma/prisma.config";
import InvalidAccessException from "../../../exception/Invalid-access.exception";
import {
    ResponseStatus,
} from "../../../response/response-status";
import {
    Member,
} from "@prisma/client";
import InvalidJwtException from "../../../exception/Invalid-jwt.exception";

export const JWT_STRATEGY = "jwt-strategy";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY) {
    constructor(
        readonly configService: ConfigService,
        private readonly prismaConfig: PrismaConfig
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("JWT_SECRET") ?? "secret",
        });
    }

    async validate(payload: { sub: string }): Promise<Member> {
        const member = await this.prismaConfig.member.findUnique({
            where: {
                id: BigInt(payload.sub),
            },
        });
        if (!member) throw new InvalidAccessException(ResponseStatus.AUTH_FO04);

        return member;
    }

}