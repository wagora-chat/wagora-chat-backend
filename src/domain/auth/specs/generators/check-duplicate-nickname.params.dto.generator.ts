import {
    fakerKO as faker,
} from "@faker-js/faker";

export default class CheckDuplicateNicknameParamsDtoGenerator {
    static request() {
        return {
            nickname: faker.person.fullName(),
        };
    }

    static response() {
        return {
            result: faker.datatype.boolean(),
        };
    }
}