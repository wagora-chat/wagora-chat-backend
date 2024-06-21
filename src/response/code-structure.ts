type ResponseCodeType = {
    code: string,
    message: string
}

const createResponseCode = (code: string, message: string): ResponseCodeType => ({
    code,
    message,
});

export const ResponseCode = {
    UNKNOWN_F: createResponseCode("UNKNOWN_F", "Unknown Server Error"),
    DEFAULT_F: createResponseCode("DEFAULT_F", "Server Handling Exception"),
    AUTH_F001: createResponseCode("AUTH_F001", "Email Property is Duplicated"),
    AUTH_F002: createResponseCode("AUTH_F002", "Nickname is Duplicated"),
    AUTH_F003: createResponseCode("AUTH_F003", "Invalid Email"),
    AUTH_F004: createResponseCode("AUTH_F004", "Invalid Email"),
    AUTH_S001: createResponseCode("AUTH_S001", "POST /auth/signup"),
    AUTH_S002: createResponseCode("AUTH_S002", "POST /auth/emails"),
    AUTH_S003: createResponseCode("AUTH_S003", "POST /auth/emails/confirm"),
    AUTH_S004: createResponseCode("AUTH_S004", "GET /auth/nicknames"),
    AUTH_S005: createResponseCode("AUTH_S005", "GET /auth/emails"),
    FILE_S001: createResponseCode("FILE_S001", "POST /files"),
} as const;
