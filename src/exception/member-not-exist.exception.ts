import {
    NotFoundException,
} from "./http/not-found.exception";
import {
    ResponseStatus,
} from "../response/response-status";

export default class MemberNotExistException extends NotFoundException {
    constructor() {
        super("Member Not Exists", ResponseStatus.AUTH_F007);
    }
}