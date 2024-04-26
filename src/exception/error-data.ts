import {
    ErrorObject,
} from "./error-object";

export interface ErrorData {
    // TODO: ErrorCode 정책 정하면 추가
    data: ErrorObject,
    timestamp: string
}
