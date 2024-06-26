import {
    HttpException, HttpStatus,
} from "@nestjs/common";
import {
    ResponseCode,
} from "../../response/response-code.enum";

export class ForbiddenException extends HttpException {
    constructor(value: string, errorCode: ResponseCode) {
        super({
            message: `${value} Forbidden`,
            errorCode: errorCode,
        }, HttpStatus.FORBIDDEN);
    }
}