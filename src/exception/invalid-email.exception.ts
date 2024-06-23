import {
    BadRequestException,
} from "@nestjs/common";
import {
    ResponseStatus,
} from "../response/response-status";

export default class InvalidEmailException extends BadRequestException {
    constructor() {
        super({
            message: "Invalid Email",
            errorCode: ResponseStatus.AUTH_F003,
        });
    }
}