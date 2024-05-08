import {
    ConflictException,
} from "@nestjs/common";
import {
    ErrorCode,
} from "../error-code.enum";

export class DuplicateEmailException extends ConflictException {
    constructor() {
        super({
            message: "Email Property is Duplicated",
            errorCode: ErrorCode.AUTH_F001,
        });
    }
}