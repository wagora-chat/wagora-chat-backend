import {
    ResponseCode,
} from "./response-code.enum";

export default class Response<T> {
    constructor(readonly code: ResponseCode,
                readonly data: T,
                readonly timestamp: Date) {
    }
}