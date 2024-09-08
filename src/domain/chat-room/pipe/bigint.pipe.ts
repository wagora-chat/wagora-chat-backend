import InvalidParamsException from "../../../exception/invalid-params.exception";
import {
    Injectable, PipeTransform,
} from "@nestjs/common";

@Injectable()
export class BigIntPipe implements PipeTransform {
    transform(value: string) {
        const result = BigInt(value);
        if (isNaN(Number(result))) {
            throw new InvalidParamsException();
        }

        return result;
    }
}