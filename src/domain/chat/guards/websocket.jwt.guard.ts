import {
    CanActivate, ExecutionContext, Injectable, 
} from "@nestjs/common";
import {
    WsException, 
} from "@nestjs/websockets";
import {
    Observable, 
} from "rxjs";
import {
    JwtService,
} from "@nestjs/jwt";
import {
    ConfigService,
} from "@nestjs/config";

@Injectable()
export class WebSocketJwtGuard implements CanActivate {
    private readonly jwtSecret: string;

    constructor(configService: ConfigService,
                private readonly jwtService: JwtService) {
        this.jwtSecret = configService.get<string>("JWT_SECRET") ?? "secret";
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const client = context.switchToWs().getClient();
        const authToken = client.handshake.headers["authorization"];

        if (!authToken) {
            throw new WsException("Missing authorization token");
        }

        try {
            // Bearer 토큰에서 실제 JWT 토큰 부분만 추출
            const token = authToken.split(" ")[1];
            const decoded = this.jwtService.verify(token, {
                secret: this.jwtSecret,
            }
            );

            client.memberId = decoded.sub;

            // 인증 성공하면 true 반환
            return true;
        } catch (error) {
            throw new WsException("Invalid token");
        }
    }
}