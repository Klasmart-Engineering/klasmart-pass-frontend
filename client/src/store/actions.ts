export interface Action<T extends ActionTypes, P> {
  type: T;
  payload: P;
}

export type SignUpAction = Action<
  ActionTypes.SIGNUP,
  | {
      accountId?: string | any;
    }
  | any
  | undefined
>;

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
  SIGNUP,
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
  | SignUpAction
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
