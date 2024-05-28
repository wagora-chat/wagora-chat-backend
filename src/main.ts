import {
    NestFactory,
} from "@nestjs/core";
import {
    AppModule,
} from "./app.module";
import {
    HttpExceptionFilter,
} from "./filter/http-exception.filter";
import {
    ValidationPipe,
} from "@nestjs/common";
import {
    DocumentBuilder, SwaggerModule,
} from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({
        transform: true,
    }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.enableCors({
        origin: true,
        credentials: true,
        methods: ["GET",
            "POST",
            "OPTIONS",
            "PUT",
            "PATCH",
            "DELETE",],
    });
    const options = new DocumentBuilder()
        .setTitle("Wagora Chat API")
        .setDescription("Wagora Chating Service API Server")
        .setVersion("0.0.1")
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("apiDocs", app, document);

    await app.listen(3000);
}

bootstrap();
