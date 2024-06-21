import {
    ForbiddenException,
} from "./http/forbidden.exception";
import {
    ResponseCodeType,
} from "../response/code-structure";

export class AuthEmailConfirmException extends ForbiddenException {
    constructor(errorCode: ResponseCodeType) {
        super("Invalid Email", errorCode);
    }
}