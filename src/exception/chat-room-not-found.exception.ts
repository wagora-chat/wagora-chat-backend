import {
    NotFoundException,
} from "./http/not-found.exception";
import {
    ResponseStatusType,
} from "../response/response-status";

export class ChatRoomNotFoundException extends NotFoundException {
    constructor(errorCode: ResponseStatusType) {
        super("Not Found Chat Room", errorCode);
    }

}