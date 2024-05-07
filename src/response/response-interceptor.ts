import {
    CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from "@nestjs/common";
import Response from "./response";
import {
    map,
} from "rxjs";
import ResponseData from "./response-data";

@Injectable()
export default class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        return next
            .handle()
            .pipe(map((data: ResponseData<object>) => new Response(
                data.code, data.data, new Date()
            )));
    }
}