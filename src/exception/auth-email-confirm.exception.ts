import {
    ForbiddenException,
} from "./http/forbidden.exception";
import {
    ResponseCode,
} from "../response/response-code.enum";

export class AuthEmailConfirmException extends ForbiddenException {
    constructor(errorCode: ResponseCode) {
        super("Invalid Email", errorCode);
    }
}