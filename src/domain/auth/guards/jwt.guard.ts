import {
    ExecutionContext,
    Injectable,
} from "@nestjs/common";
import {
    AuthGuard,
} from "@nestjs/passport";
import {
    JWT_STRATEGY,
} from "../strategies/jwt.strategy";
import {
    Reflector,
} from "@nestjs/core";
import {
    Observable,
} from "rxjs";
import InvalidJwtException from "../../../exception/Invalid-jwt.exception";
import {
    ResponseStatus,
} from "../../../response/response-status";

@Injectable()
export class JwtGuard extends AuthGuard(JWT_STRATEGY) {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest(err: Error | null, user: any, info: any, context: ExecutionContext) {
        if (err || !user) {
            throw new InvalidJwtException(ResponseStatus.AUTH_F005);
        }

        return user;
    }
}