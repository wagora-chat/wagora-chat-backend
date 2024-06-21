import {
    ConflictException,
} from "@nestjs/common";
import {
    ResponseStatus,
} from "../response/response-status";

export class DuplicateEmailException extends ConflictException {
    constructor() {
        super({
            message: "Email Property is Duplicated",
            errorCode: ResponseStatus.AUTH_F001,
        });
    }
}