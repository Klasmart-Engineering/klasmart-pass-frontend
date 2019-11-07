export interface Action<T extends ActionTypes, P> {
    type: T;
    payload: P;
}
export type LoginAction = Action<ActionTypes.LOGIN, {
    sessionId?: string | any,
    accountId?: string | any,
    email?: string | any,
    refreshToken?: string | any,
    refreshTokenExpire?: number | any,
    accessToken?: string | any,
    accessTokenExpire?: number | any,
}|any|undefined>;
export type SignUpAction = Action<ActionTypes.SIGNUP, {
    accountId?: string | any,
}|any|undefined>;
export type RefreshSessionAction = Action<ActionTypes.REFRESH_SESSION, {
    accessToken?: string | any,
    accessTokenExpire?: number | any,
}|any|undefined>;
export type DeviceIdAction = Action<ActionTypes.DEVICE_ID, string>;

export enum ActionTypes {
    LOGIN,
    SIGNUP,
    REFRESH_SESSION,
    DEVICE_ID,
}

export type Actions =
    | LoginAction
    | SignUpAction
    | RefreshSessionAction
    | DeviceIdAction
    | never;
