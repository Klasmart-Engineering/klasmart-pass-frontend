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
} | any | undefined>;
export interface LogoutAction { type: ActionTypes.LOGOUT; }

export type SignUpAction = Action<ActionTypes.SIGNUP, {
    accountId?: string | any,
} | any | undefined>;
export type RefreshSessionAction = Action<ActionTypes.REFRESH_SESSION, {
    accessToken?: string | any,
    accessTokenExpire?: number | any,
} | any | undefined>;

export interface AccessTokenExpiredAction { type: ActionTypes.EXPIRED_ACCESS_TOKEN; }
export interface RefreshTokenExpiredAction { type: ActionTypes.EXPIRED_REFRESH_TOKEN; }

export type DeviceIdAction = Action<ActionTypes.DEVICE_ID, string>;
export type AccountIdAction = Action<ActionTypes.ACCOUNT_ID, {
    accountId?: string | any,
} | any | undefined>;

export type PostAuthorizationRouteAction = Action<ActionTypes.POST_AUTHORIZATION_ROUTE, string>;
export type ProductIdAction = Action<ActionTypes.PRODUCT_ID, string>;
export type SetEMailAction = Action<ActionTypes.EMAIL, string>;
export type SetLocale = Action<ActionTypes.LOCALE, string>;

export enum ActionTypes {
    LOGIN,
    LOGOUT,
    SIGNUP,
    REFRESH_SESSION,
    EXPIRED_ACCESS_TOKEN,
    EXPIRED_REFRESH_TOKEN,
    ACCOUNT_ID,
    DEVICE_ID,
    POST_AUTHORIZATION_ROUTE,
    PRODUCT_ID,
    EMAIL,
    LOCALE,
}

export type Actions =
    | LoginAction
    | LogoutAction
    | SignUpAction
    | RefreshSessionAction
    | AccessTokenExpiredAction
    | RefreshTokenExpiredAction
    | DeviceIdAction
    | AccountIdAction
    | PostAuthorizationRouteAction
    | ProductIdAction
    | SetEMailAction
    | SetLocale
    | never;
