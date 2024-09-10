export const memberFixture
    = (encryptedPassword: string) => {
        return {
            email: "fixtureEmail@naver.com",
            password: encryptedPassword,
            nickname: "fixture",
            fileId: 1,
        };
    };

export const memberRandomFixture
    = (encryptedPassword: string, count = 1) => {
        return {
            email: `fixtureEmail${count}@naver.com`,
            password: encryptedPassword,
            nickname: `fixture${count}`,
            fileId: 1,
        };
    };