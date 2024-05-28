import {
    ResponseCode,
} from "./response-code.enum";

export default class CustomResponse<T> {
    readonly timestamp: string;

    constructor(readonly code: ResponseCode,
                readonly data: T,) {
        this.timestamp = new Date().toISOString();
    }
}