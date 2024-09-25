export const validVerifyCodeEmailRequestDTOFixture = {
    email: "test1234@gmail.com",
    code: "123456",
};

export const invalidCodeVerifyCodeEmailRequestDTOFixture = {
    email: "test1234@gmail.com",
    code: "654321",
};

export const invalidVerifyCodeEmailRequestDTOFixture = {
    email: "test4321@gmail.com",
    code: "123654",
};
