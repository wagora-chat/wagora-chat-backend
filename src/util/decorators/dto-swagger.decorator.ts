import {
    applyDecorators,
} from "@nestjs/common";
import {
    ApiBody, ApiConsumes,
} from "@nestjs/swagger";

export const FileUploadSwaggerDecorator = () => {
    return applyDecorators(
        ApiConsumes("multipart/form-data"), ApiBody({
            schema: {
                type: "object",
                properties: {
                    file: {
                        type: "string",
                        format: "binary",
                    },
                },
            },
        })
    );
};