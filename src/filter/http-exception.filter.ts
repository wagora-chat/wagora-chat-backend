import {
    Request, Response,
} from "express";
import {
    ArgumentsHost,
    Catch, ExceptionFilter, HttpException, HttpStatus, Logger,
} from "@nestjs/common";
import {
    ErrorData,
} from "../exception/error-data";
import {
    ErrorObject,
} from "../exception/error-object";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        let errorMessage: any = exception.getResponse();
        if (typeof errorMessage === "object") {
            errorMessage = errorMessage.message;
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
            data: errorObject,
            timestamp: new Date().toISOString(),
        };

        response.status(status).json(errorData);
    }

}