import {
    Request, Response,
} from "express";
import {
    ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger,
} from "@nestjs/common";
import {
    ErrorData,
} from "../exception/error-data";
import {
    ErrorObject,
} from "../exception/error-object";
import {
    ErrorResponseType, isCustomErrorResponseType, isDefaultErrorResponseType,
} from "../exception/error-type";
import {
    ResponseCode,
} from "../exception/error-code.enum";

@Catch(HttpException)

export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        const errorResponse = exception.getResponse() as ErrorResponseType;
        let errorMessage: string;
        let code: ResponseCode;

        if (isCustomErrorResponseType(errorResponse)) {
            errorMessage = errorResponse.message;
            code = errorResponse.errorCode;
        } else if (isDefaultErrorResponseType(errorResponse)) {
            errorMessage = errorResponse.message;
            code = ResponseCode.DEFAULT_F001;
        } else {
            errorMessage = errorResponse;
            code = ResponseCode.UNKNOWN_F001;
        }
        this.logger.error(
            `Error Occur ${request.url} ${request.method}, errorMessage: ${JSON.stringify(errorMessage, null, 2)}`,
        );

        const errorObject: ErrorObject = {
            status: status,
            message: errorMessage,
            path: request.url,
            error: HttpStatus[status],
        };
        const errorData: ErrorData = {
            code: code,
            data: errorObject,
            timestamp: new Date().toISOString(),
        };

        response.status(status).json(errorData);
    }

}