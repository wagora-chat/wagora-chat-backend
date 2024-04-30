import {
    HttpException, HttpStatus,
} from "@nestjs/common";

export class NotFoundException extends HttpException {
    constructor(value: string) {
        super(`${value} Not Found`, HttpStatus.NOT_FOUND);
    }
}