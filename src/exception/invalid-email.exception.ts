import {
    BadRequestException,
} from "@nestjs/common";
import {
    ResponseCode,
} from "../response/code-structure";

export default class InvalidEmailException extends BadRequestException {
    constructor() {
        super({
            message: "Invalid Email",
            errorCode: ResponseCode.AUTH_F003,
        });
    }
}