export interface Action<T extends ActionTypes, P> {
  type: T;
  payload: P;
}

export interface LogoutAction {
  type: ActionTypes.LOGOUT;
}

export type SignUpAction = Action<
  ActionTypes.SIGNUP,
  | {
      accountId?: string | any;
    }
  | any
  | undefined
>;
export type RefreshSessionAction = Action<
  ActionTypes.REFRESH_SESSION,
  | {
      accessToken?: string | any;
      accessTokenExpire?: number | any;
    }
  | any
  | undefined
>;

export interface AccessTokenExpiredAction {
  type: ActionTypes.EXPIRED_ACCESS_TOKEN;
}
export interface RefreshTokenExpiredAction {
  type: ActionTypes.EXPIRED_REFRESH_TOKEN;
}

export type AccountIdAction = Action<
  ActionTypes.ACCOUNT_ID,
  | {
      accountId?: string | any;
    }
  | any
  | undefined
>;

export type PostAuthorizationRouteAction = Action<
  ActionTypes.POST_AUTHORIZATION_ROUTE,
  string
>;
export type ProductIdAction = Action<ActionTypes.PRODUCT_ID, string>;

export type SetEMailAction = Action<ActionTypes.EMAIL, string>;
export type SetLocale = Action<ActionTypes.LOCALE, string>;

export type SimulateUnstableConnection = Action<
  ActionTypes.SIMULATE_UNSTABLE_CONNECTION,
  boolean
>;
export type SetFakeNonce = Action<
  ActionTypes.FAKE_NONCE,
  undefined | null | string
>;

export type VerificationToken = Action<
  ActionTypes.VERIFICATION_TOKEN,
  | {
      verificationToken?: string | any;
    }
  | any
  | undefined
>;

export enum ActionTypes {
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
  VERIFICATION_TOKEN,
  // Testing
  FAKE_NONCE,
  SIMULATE_UNSTABLE_CONNECTION,
}

export type Actions =
  | LogoutAction
  | SignUpAction
  | RefreshSessionAction
  | AccessTokenExpiredAction
  | RefreshTokenExpiredAction
  | AccountIdAction
  | PostAuthorizationRouteAction
  | ProductIdAction
  | SetEMailAction
  | SetLocale
  // Testing
  | SetFakeNonce
  | SimulateUnstableConnection
  | VerificationToken
  | never;
