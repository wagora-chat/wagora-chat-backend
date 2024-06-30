import {
    HttpException, HttpStatus, 
} from "@nestjs/common";
import {
    ResponseStatusType, 
} from "../../response/response-status";

export class UnauthorizedException extends HttpException {
    constructor(value: string, errorCode: ResponseStatusType) {
        super({
            message: `${value}`,
            errorCode: errorCode,
        }, HttpStatus.UNAUTHORIZED);
    }
}
