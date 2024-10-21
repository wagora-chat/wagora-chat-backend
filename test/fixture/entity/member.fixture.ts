export const memberFixture
    = (encryptedPassword: string) => {
        return {
            email: "fixtureEmail@naver.com",
            password: encryptedPassword,
            nickname: "fixture",
            profile: "fixtureProfile",
        };
    };

export const memberRandomFixture
    = (encryptedPassword: string, count = 1) => {
        return {
            email: `fixtureEmail${count}@naver.com`,
            password: encryptedPassword,
            nickname: `fixture${count}`,
            profile: "fixtureProfile",
        };
    };

export const memberRandomListFixture
    = (bcryptPassword: string, sequenceCount = 1) => {
        const members = [];

        for (let i = 0; i < sequenceCount; i++) {
            const randomMember = memberRandomFixture(
                bcryptPassword, i
            );

            members.push(randomMember);
        }

        return members;
    };