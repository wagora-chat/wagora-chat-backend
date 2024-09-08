import InvalidParamsException from "../../../exception/invalid-params.exception";
import {
    Injectable, PipeTransform,
} from "@nestjs/common";

@Injectable()
export class BigIntPipe implements PipeTransform {
    transform(value: string) {
        try {
            return BigInt(value);
        } catch (e) {
            throw new InvalidParamsException();
        }
    }
}