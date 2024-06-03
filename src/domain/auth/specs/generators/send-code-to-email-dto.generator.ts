import {
    fakerKO as faker,
} from "@faker-js/faker";
import {
    SendCodeToEmailRequestDto,
} from "../../dto/req/send-code-to-email.request.dto";
import {
    SendCodeToEmailResponseDto,
} from "../../dto/res/send-code-to-email.response.dto";

export default class SendCodeToEmailDtoGenerator {
    static request(): SendCodeToEmailRequestDto {
        return {
            email: faker.internet.email(),
        };
    }

    static response(email: string): SendCodeToEmailResponseDto {
        return {
            email: email,
        };
    }
}