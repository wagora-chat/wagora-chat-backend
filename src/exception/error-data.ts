import {
    ErrorObject,
} from "./error-object";
import {
    ErrorCode,
} from "./error-code.enum";

export interface ErrorData {
    code: ErrorCode,
    data: ErrorObject,
    timestamp: string
}
