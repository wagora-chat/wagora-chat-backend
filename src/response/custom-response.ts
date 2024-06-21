export default class CustomResponse<T> {
    readonly timestamp: string;

    constructor(readonly code: string,
                readonly data: T,) {
        this.timestamp = new Date().toISOString();
    }
}