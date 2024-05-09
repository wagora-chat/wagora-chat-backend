import {
    ForbiddenException,
} from "./http/forbidden.exception";
import {
    ResponseCode,
} from "./error-code.enum";

export class AuthEmailConfirmException extends ForbiddenException {
    constructor(value: string, errorCode: ResponseCode) {
        super(value, errorCode);
    }
}