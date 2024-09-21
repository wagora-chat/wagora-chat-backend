import {
    fakerKO as faker,
} from "@faker-js/faker";

export default class FileEntityGenerator {
    static file() {
        return {
            id: faker.number.bigInt(),
            message: faker.string.sample(),
            createdAt: faker.date.recent(),
            memberId: faker.number.bigInt(),
            roomId: faker.number.bigInt(),
        };
    }
}