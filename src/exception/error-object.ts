import {
    ErrorData,
} from "./error-data";
import {
    ResponseCode,
} from "./error-code.enum";

export interface ErrorObject {
    code: ResponseCode,
    data: ErrorData,
    timestamp: string
}
