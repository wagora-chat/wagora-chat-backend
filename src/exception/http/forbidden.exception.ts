import {
    HttpException, HttpStatus,
} from "@nestjs/common";
import {
    ResponseStatusType,
} from "../../response/response-status";

export class ForbiddenException extends HttpException {
    constructor(value: string, errorCode: ResponseStatusType) {
        super({
            message: `${value} Forbidden`,
            errorCode: errorCode,
        }, HttpStatus.FORBIDDEN);
    }
}