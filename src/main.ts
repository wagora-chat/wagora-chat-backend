import {
    NestFactory,
} from "@nestjs/core";
import {
    AppModule,
} from "./app.module";
import {
    HttpExceptionFilter,
} from "./filter/http-exception.filter";
import ResponseInterceptor from "./response/response-interceptor";
import {
    ValidationPipe,
} from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({
        transform: true,
    }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());

    await app.listen(3000);
}

bootstrap();
