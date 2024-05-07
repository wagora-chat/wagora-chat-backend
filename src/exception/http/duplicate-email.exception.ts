import {
    HttpException, HttpStatus,
} from "@nestjs/common";
import {
    ErrorCode,
} from "../error-code.enum";

export class DuplicateEmailException extends HttpException {
    constructor() {
        super({
            message: "Email Property is Duplicated",
            errorCode: ErrorCode.AUTH_F001,
        }, HttpStatus.CONFLICT);
    }
}