import {
    ConflictException,
} from "@nestjs/common";
import {
    ResponseCode,
} from "../response/code-structure";

export class DuplicateEmailException extends ConflictException {
    constructor() {
        super({
            message: "Email Property is Duplicated",
            errorCode: ResponseCode.AUTH_F001,
        });
    }
}