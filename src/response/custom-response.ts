import {
    ResponseStatusType,
} from "./response-status";

export default class CustomResponse<T> {
    readonly timestamp: string;

    constructor(readonly customStatus: ResponseStatusType,
                readonly data: T,) {
        this.timestamp = new Date().toISOString();
    }
}