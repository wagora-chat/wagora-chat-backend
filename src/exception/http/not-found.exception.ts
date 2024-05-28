import {
    HttpException, HttpStatus,
} from "@nestjs/common";
import {
    ResponseCode,
} from "../../response/response-code.enum";

export class NotFoundException extends HttpException {
    constructor(value: string, errorCode: ResponseCode) {
        super({
            message: `${value} Not Found`,
            errorCode: errorCode,
        }, HttpStatus.NOT_FOUND);
    }
}