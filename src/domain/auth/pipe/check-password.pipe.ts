import {
    BadRequestException, PipeTransform,
} from "@nestjs/common";
import SignupRequestDto from "../dto/req/signup.request.dto";

export default class CheckPasswordPipe implements PipeTransform {
    transform(signupRequestDto: SignupRequestDto): SignupRequestDto {
        const isEqualPasswordAndCheckPassword =
            signupRequestDto.password === signupRequestDto.checkPassword;

        if (!isEqualPasswordAndCheckPassword) {
            throw new BadRequestException("Not Equals Check Password");
        }

        return signupRequestDto;
    }
}