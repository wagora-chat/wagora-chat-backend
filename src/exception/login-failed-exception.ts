import {
    UnauthorizedException,
} from "./http/unauthorized.exception";
import {
    ResponseStatusType,
} from "../response/response-status";

export default class LoginFailedException extends UnauthorizedException {
    constructor(invalidCredentials: string, errorCode: ResponseStatusType) {
        super("Login Failed", errorCode);
    }
}
