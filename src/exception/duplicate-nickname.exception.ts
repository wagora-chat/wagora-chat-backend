import {
    ConflictException,
} from "@nestjs/common";
import {
    ResponseStatus,
} from "../response/response-status";

export class DuplicateNicknameException extends ConflictException {
    constructor() {
        super({
            message: "Nickname is Duplicated",
            errorCode: ResponseStatus.AUTH_F002,
        });
    }
}