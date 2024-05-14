import {
    BadRequestException,
} from "@nestjs/common";
import {
    ResponseCode,
} from "../response/response-code.enum";

export default class NotValidatedEmailException extends BadRequestException {
    constructor() {
        super({
            message: "Not Validated Email",
            errorCode: ResponseCode.AUTH_F004,
        });
    }
}