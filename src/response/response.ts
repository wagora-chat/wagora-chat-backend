import {
    ResponseCode,
} from "./response-code.enum";

export default class Response<T> {
    readonly timestamp: Date;

    constructor(readonly code: ResponseCode,
                readonly data: T,) {
        this.timestamp = new Date();
    }
}