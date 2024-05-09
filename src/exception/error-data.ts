import {
    ErrorObject,
} from "./error-object";
import {
    ResponseCode,
} from "./error-code.enum";

export interface ErrorData {
    code: ResponseCode,
    data: ErrorObject,
    timestamp: string
}
