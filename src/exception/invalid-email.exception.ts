import {
    BadRequestException,
} from "@nestjs/common";
import {
    ResponseStatus, ResponseStatusType,
} from "../response/response-status";

export default class InvalidEmailException extends BadRequestException {
    constructor(errorCode: ResponseStatusType) {
        super({
            message: "Invalid Email",
            errorCode,
        });
    }
}