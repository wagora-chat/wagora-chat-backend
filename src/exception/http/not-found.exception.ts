import {
    HttpException, HttpStatus,
} from "@nestjs/common";
import {
    ResponseStatusType,
} from "../../response/response-status";

export class NotFoundException extends HttpException {
    constructor(value: string, errorCode: ResponseStatusType) {
        super({
            message: `${value}`,
            errorCode: errorCode,
        }, HttpStatus.NOT_FOUND);
    }
}