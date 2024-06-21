import {
    ResponseCodeType,
} from "../response/code-structure";

export type ErrorExceptionType = string | CustomErrorResponseType | DefaultErrorResponseType
export type CustomErrorResponseType = { message: string, errorCode: ResponseCodeType }
export type DefaultErrorResponseType = { message: string, status: number }

export function isCustomErrorExceptionType(response: ErrorExceptionType)
    : response is { message: string, errorCode: ResponseCodeType } {
    return typeof response === "object" && "message" in response && "errorCode" in response;
}

export function isDefaultErrorExceptionType(response: ErrorExceptionType)
    : response is { message: string, status: number } {
    return typeof response === "object" && "message" in response && "status" in response;
}