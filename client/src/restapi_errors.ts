export class RestAPIError extends Error {
    private type: RestAPIErrorType;
    private body: { [key: string]: any };
    constructor(type: RestAPIErrorType, body: { [key: string]: any }) {
        super();
        if (typeof RestAPIErrorType[type] === "undefined") {
            this.type = RestAPIErrorType.UNKNOWN;
        } else {
            this.type = type;
        }
        this.body = body;
    }
    public getBody() { return this.body; }
    public getErrorMessageType() {
        return this.type;
    }
    public getErrorMessageID() {
        return errorCodeToMessageID[this.type];
    }
}
export enum RestAPIErrorType {
    MOCK = -2,
    UNKNOWN = -1,
    INTERNAL_SERVER_ERROR = 1,
    FUNCTION_NOT_FOUND = 2,
    BAD_REQUEST_METHOD = 3,
    BAD_REQUEST_BODY = 4,
    INVALID_PARAMETERS = 5,
    EXPIRED_ACCESS_TOKEN = 6,
    FUNCTION_TIMEOUT = 7,
    TOO_MANY_REQUESTS = 8,
    ITEM_NOT_FOUND = 9,
    REACHED_MAX_LIMIT = 10,
    UNAUTHORIZED = 11,
    ITEM_ALREADY_EXISTS = 12,
    ITEM_NOT_READY = 13,

    // Login
    INVALID_LOGIN = 20,
    INVALID_PASSWORD = 21,
    EMAIL_NOT_VERIFIED = 22,
    ACCOUNT_BANNED = 23,
    DEVICE_NOT_FOUND = 24,
    EXPIRED_REFRESH_TOKEN = 25,

    // Sign Up
    INVALID_EMAIL_FORMAT = 40,
    INVALID_EMAIL_HOST = 41,
    EMAIL_ALREADY_USED = 42,
    PASSWORD_TOO_SHORT = 43,
    PASSWORD_TOO_LONG = 44,
    PASSWORD_NUMBER_MISSING = 45,
    PASSWORD_UPPERCASE_MISSING = 46,
    PASSWORD_LOWERCASE_MISSING = 47,

    // Verification
    INVALID_VERIFICATION_CODE = 60,
    VERIFICATION_NOT_FOUND = 61,
}

const errorCodeToMessageID = {
    [RestAPIErrorType.MOCK]: "ERROR_MOCK",
    [RestAPIErrorType.UNKNOWN]: "ERROR_UNKOWN",
    // General
    [RestAPIErrorType.INTERNAL_SERVER_ERROR]: "ERROR_INTERNAL_SERVER_ERROR",
    [RestAPIErrorType.FUNCTION_NOT_FOUND]: "ERROR_FUNCTION_NOT_FOUND",
    [RestAPIErrorType.BAD_REQUEST_METHOD]: "ERROR_BAD_REQUEST_METHOD",
    [RestAPIErrorType.BAD_REQUEST_BODY]: "ERROR_BAD_REQUEST_BODY",
    [RestAPIErrorType.INVALID_PARAMETERS]: "ERROR_INVALID_PARAMETERS",
    [RestAPIErrorType.EXPIRED_ACCESS_TOKEN]: "ERROR_EXPIRED_ACCESS_TOKEN",
    [RestAPIErrorType.FUNCTION_TIMEOUT]: "ERROR_FUNCTION_TIMEOUT",
    [RestAPIErrorType.TOO_MANY_REQUESTS]: "ERROR_TOO_MANY_REQUESTS",
    [RestAPIErrorType.ITEM_NOT_FOUND]: "ERROR_ITEM_NOT_FOUND",
    [RestAPIErrorType.REACHED_MAX_LIMIT]: "ERROR_REACHED_MAX_LIMIT",
    [RestAPIErrorType.UNAUTHORIZED]: "ERROR_UNAUTHORIZED",
    [RestAPIErrorType.ITEM_ALREADY_EXISTS]: "ERROR_ITEM_ALREADY_EXISTS",
    [RestAPIErrorType.ITEM_NOT_READY]: "ERROR_ITEM_NOT_READY",

    // Login
    [RestAPIErrorType.INVALID_LOGIN]: "ERROR_INVALID_LOGIN",
    [RestAPIErrorType.INVALID_PASSWORD]: "ERROR_INVALID_PASSWORD",
    [RestAPIErrorType.EMAIL_NOT_VERIFIED]: "ERROR_EMAIL_NOT_VERIFIED",
    [RestAPIErrorType.ACCOUNT_BANNED]: "ERROR_ACCOUNT_BANNED",
    [RestAPIErrorType.DEVICE_NOT_FOUND]: "ERROR_DEVICE_NOT_FOUND",
    [RestAPIErrorType.EXPIRED_REFRESH_TOKEN]: "ERROR_EXPIRED_REFRESH_TOKEN",

    // Sign Up
    [RestAPIErrorType.INVALID_EMAIL_FORMAT]: "sign_up_error_INVALID_EMAIL",
    [RestAPIErrorType.INVALID_EMAIL_HOST]: "sign_up_error_INVALID_EMAIL",
    [RestAPIErrorType.EMAIL_ALREADY_USED]: "sign_up_error_EMAIL_ALREADY_USED",
    [RestAPIErrorType.PASSWORD_TOO_SHORT]: "sign_up_error_PASSWORD_TOO_SHORT",
    [RestAPIErrorType.PASSWORD_TOO_LONG]: "sign_up_error_PASSWORD_TOO_LONG",
    [RestAPIErrorType.PASSWORD_NUMBER_MISSING]: "sign_up_error_PASSWORD_NUMBER_MISSING",
    [RestAPIErrorType.PASSWORD_UPPERCASE_MISSING]: "sign_up_error_PASSWORD_UPPERCASE_MISSING",
    [RestAPIErrorType.PASSWORD_LOWERCASE_MISSING]: "sign_up_error_PASSWORD_LOWERCASE_MISSING",

    // Verification
    [RestAPIErrorType.INVALID_VERIFICATION_CODE]: "ERROR_INVALID_VERIFICATION_CODE",
    [RestAPIErrorType.VERIFICATION_NOT_FOUND]: "ERROR_VERIFICATION_NOT_FOUND",
};
