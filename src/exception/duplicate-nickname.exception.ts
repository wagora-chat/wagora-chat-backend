import {
    ConflictException,
} from "@nestjs/common";
import {
    ResponseCode,
} from "../response/response-code.enum";

export class DuplicateNicknameException extends ConflictException {
    constructor() {
        super({
            message: "Nickname is Duplicated",
            errorCode: ResponseCode.AUTH_F002,
        });
    }
}