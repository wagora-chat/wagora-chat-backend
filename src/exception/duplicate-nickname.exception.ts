import {
    ConflictException,
} from "@nestjs/common";
import {
    ResponseCode,
} from "../response/code-structure";

export class DuplicateNicknameException extends ConflictException {
    constructor() {
        super({
            message: "Nickname is Duplicated",
            errorCode: ResponseCode.AUTH_F002,
        });
    }
}