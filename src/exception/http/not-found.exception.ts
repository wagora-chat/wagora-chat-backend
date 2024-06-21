import {
    HttpException, HttpStatus,
} from "@nestjs/common";
import {
    ResponseCodeType,
} from "../../response/code-structure";

export class NotFoundException extends HttpException {
    constructor(value: string, errorCode: ResponseCodeType) {
        super({
            message: `${value} Not Found`,
            errorCode: errorCode,
        }, HttpStatus.NOT_FOUND);
    }
}