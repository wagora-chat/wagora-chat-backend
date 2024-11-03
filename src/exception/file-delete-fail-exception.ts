import {
    BadRequestException,
} from "./http/bad-request.exception";
import {
    ResponseStatusType,
} from "../response/response-status";

export class FileDeleteFailException extends BadRequestException {
    constructor(errorCode: ResponseStatusType) {
        super("file delete fail", errorCode);

    }
}