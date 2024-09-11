import NotFoundException from "./websocket/not-found.exception";
import {
    ResponseStatusType,
} from "../response/response-status";

export default class ChatRoomNotExistsException extends NotFoundException {
    constructor(errorCode: ResponseStatusType) {
        super("Not exists Chat Room", errorCode);
    }
}