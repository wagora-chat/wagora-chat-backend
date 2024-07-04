import {
    HttpException, HttpStatus,
} from "@nestjs/common";
import {
    ResponseStatusType,
} from "../../response/response-status";

export class BadRequestException extends HttpException {
    constructor(value: string, errorCode: ResponseStatusType) {
        super({
            message: `${value} Bad Request`,
            errorCode: errorCode,
        }, HttpStatus.BAD_REQUEST);
    }
}