import {
    NotFoundException,
} from "./http/not-found.exception";
import {
    ResponseStatusType,
} from "../response/response-status";

export class FileNotFoundException extends NotFoundException {
    constructor(errorCode: ResponseStatusType) {
        super("Not Found File", errorCode);
    }
}