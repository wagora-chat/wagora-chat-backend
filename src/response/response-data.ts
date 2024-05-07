import {
    ResponseCode,
} from "./response-code.enum";

export default class ResponseData<T> {
    constructor(readonly code: ResponseCode, readonly data: T) {
    }
}