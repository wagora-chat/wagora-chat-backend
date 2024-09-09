const createResponseStatus = (code: string, message: string): ResponseStatusType => ({
    code,
    message,
});

export const ResponseStatus = {
    UNKNOWN_F: createResponseStatus("UNKNOWN_F", "Unknown Server Error"),
    DEFAULT_F: createResponseStatus("DEFAULT_F", "Server Handling Exception"),
    AUTH_F001: createResponseStatus("AUTH_F001", "Email Property is Duplicated"),
    AUTH_F002: createResponseStatus("AUTH_F002", "Nickname is Duplicated"),
    AUTH_F003: createResponseStatus("AUTH_F003", "Invalid Email"),
    AUTH_F004: createResponseStatus("AUTH_F004", "Login Failed"),
    AUTH_F005: createResponseStatus("AUTH_F005", "Invalid Access Token"),
    AUTH_F006: createResponseStatus("AUTH_F006", "Invalid JWT"),
    AUTH_F007: createResponseStatus("AUTH_F007", "Member Not Exists"),
    AUTH_F008: createResponseStatus("AUTH_F008", "Invalid Email in to send temp password"),
    AUTH_S001: createResponseStatus("AUTH_S001", "POST /auth/signup"),
    AUTH_S002: createResponseStatus("AUTH_S002", "POST /auth/emails"),
    AUTH_S003: createResponseStatus("AUTH_S003", "POST /auth/emails/confirm"),
    AUTH_S004: createResponseStatus("AUTH_S004", "GET /auth/nicknames"),
    AUTH_S005: createResponseStatus("AUTH_S005", "GET /auth/emails"),
    AUTH_S006: createResponseStatus("AUTH_S006", "GET /auth/login"),
    AUTH_S007: createResponseStatus("AUTH_S007", "POST /auth/passwords"),
    FILE_S001: createResponseStatus("FILE_S001", "POST /files"),
    CHAT_ROOM_F001: createResponseStatus("CHAT_ROOM_F001", "Prisma Error"),
    CHAT_ROOM_F002: createResponseStatus("CHAT_ROOM_F002", "Invalid Query Params"),
    CHAT_ROOM_F003: createResponseStatus("CHAT_ROOM_F003", "Not found chatroom"),
    CHAT_ROOM_F004: createResponseStatus("CHAT_ROOM_F004", "Not found member in chatroom"),
    CHAT_ROOM_F005: createResponseStatus("CHAT_ROOM_F005", "Manager doesn't leave chatroom until only one left"),
    CHAT_ROOM_S001: createResponseStatus("CHAT_ROOM_S001", "POST /chat-rooms"),
    CHAT_ROOM_S002: createResponseStatus("CHAT_ROOM_S002", "GET /chat-rooms"),
    CHAT_ROOM_S003: createResponseStatus("CHAT_ROOM_S003", "DELETE /chat-rooms"),
} as const;
export type ResponseStatusType = {
    code: string,
    message: string
}