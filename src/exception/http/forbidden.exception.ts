import {
    HttpException, HttpStatus,
} from "@nestjs/common";
import {
    ResponseCodeType,
} from "../../response/code-structure";

export class ForbiddenException extends HttpException {
    constructor(value: string, errorCode: ResponseCodeType) {
        super({
            message: `${value} Forbidden`,
            errorCode: errorCode,
        }, HttpStatus.FORBIDDEN);
    }
}