import {
    ConflictException,
} from "@nestjs/common";
import {
    ErrorCode,
} from "../error-code.enum";

export class DuplicateNicknameException extends ConflictException {
    constructor() {
        super({
            message: "Nickname is Duplicated",
            errorCode: ErrorCode.AUTH_F002,
        });
    }
}