import {
    HttpException, HttpStatus,
} from "@nestjs/common";
import {
    ErrorCode,
} from "../error-code.enum";

export class DuplicateNicknameException extends HttpException {
    constructor() {
        super({
            message: "Nickname is Duplicated",
            errorCode: ErrorCode.AUTH_F002,
        }, HttpStatus.CONFLICT);
    }
}