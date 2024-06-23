import {
    HttpException, HttpStatus,
} from "@nestjs/common";
import {
    ResponseStatusType,
} from "../../response/response-status";

export class NotFoundException extends HttpException {
    constructor(value: string, errorCode: ResponseStatusType) {
        super({
            message: `${value} Not Found`,
            errorCode: errorCode,
        }, HttpStatus.NOT_FOUND);
    }
}