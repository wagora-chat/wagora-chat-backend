import {
    UnauthorizedException,
} from "./http/unauthorized.exception";
import {
    ResponseStatusType,
} from "../response/response-status";

export default class LoginFailedException extends UnauthorizedException {
    constructor(errorCode: ResponseStatusType) {
        super("Login Failed", errorCode);
    }
}
