import {
    NotFoundException,
} from "./http/not-found.exception";
import {
    ResponseStatusType,
} from "../response/response-status";

export default class MemberNotExistException extends NotFoundException {
    constructor(errorCode: ResponseStatusType) {
        super("Member Not Exists", errorCode);
    }
}