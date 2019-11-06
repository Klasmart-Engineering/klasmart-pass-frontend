export interface Action<T extends ActionTypes, P> {
    type: T;
    payload: P;
}
export type SetEmailAction = Action<ActionTypes.SET_EMAIL, string>;

export interface AccessToken {
    accessToken: string;
    accessTokenExpiration: number;
}
export type SetAccessTokenAction = Action<ActionTypes.SET_ACCESS_TOKEN, AccessToken>;

export interface RefreshToken {
    refreshToken: string;
    refreshTokenExpiration: number;
}
export type SetRefreshTokenAction = Action<ActionTypes.SET_REFRESH_TOKEN, RefreshToken>;
export type SetDeviceIDAction = Action<ActionTypes.SET_DEVICE_ID, string>;
export type SetAccountIDAction = Action<ActionTypes.SET_ACCOUNT_ID, string>;

export enum ActionTypes {
    SET_EMAIL,
    SET_ACCESS_TOKEN,
    SET_REFRESH_TOKEN,
    SET_DEVICE_ID,
    SET_ACCOUNT_ID,
}

export type Actions =
    | SetEmailAction
    | SetAccessTokenAction
    | SetRefreshTokenAction
    | SetDeviceIDAction
    | SetAccountIDAction
    | never;
