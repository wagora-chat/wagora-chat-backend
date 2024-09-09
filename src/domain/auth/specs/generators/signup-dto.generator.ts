import {
    fakerKO as faker,
} from "@faker-js/faker";
import SignupRequestDto from "../../dto/req/signup.request.dto";
import SignupResponseDto from "../../dto/res/signup.response.dto";

export default class SignupDtoGenerator {
    static request(): SignupRequestDto {
        return {
            email: faker.internet.email(),
            password: faker.internet.password(),
            checkPassword: faker.internet.password(),
            nickname: faker.person.fullName(),
            profile: faker.number.bigInt(),
        };
    }

    static response(): SignupResponseDto {
        return {
            id: faker.number.bigInt().toString(),
        };
    }
}