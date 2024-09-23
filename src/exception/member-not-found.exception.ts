import {
    NotFoundException,
} from "./http/not-found.exception";
import {
    ResponseStatusType,
} from "../response/response-status";

export class MemberNotFoundException extends NotFoundException {
    constructor(errorCode: ResponseStatusType) {
        super("Not Found Member", errorCode);
    }
}