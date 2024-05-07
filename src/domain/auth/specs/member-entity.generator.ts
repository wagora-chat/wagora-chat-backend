import {
    fakerKO as faker,
} from "@faker-js/faker";

export default class MemberEntityGenerator {
    static member() {
        return {
            id: faker.number.bigInt(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            nickname: faker.person.fullName(),
            profile: faker.internet.url(),
        };
    }
}