import {
    HttpException, HttpStatus,
} from "@nestjs/common";
import {
    ErrorCode,
} from "../error-code.enum";

export class NotFoundException extends HttpException {
    constructor(value: string, errorCode: ErrorCode) {
        super({
            message: `${value} Not Found`,
            errorCode: errorCode,
        }, HttpStatus.NOT_FOUND);
    }
}