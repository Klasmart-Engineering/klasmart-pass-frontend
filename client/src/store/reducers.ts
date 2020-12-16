import { combineReducers } from "redux";

import { getDefaultLanguageCode } from "../utils/locale";
import { Actions, ActionTypes } from "./actions";

export function postAuthorizationRoute(state = null, action: Actions) {
  switch (action.type) {
    case ActionTypes.POST_AUTHORIZATION_ROUTE:
      return action.payload;
    default:
      return state;
  }
}

export function sessionId(state = null, action: Actions) {
  switch (action.type) {
    case ActionTypes.LOGIN:
      if (
        typeof action.payload === "object" &&
        typeof action.payload.sessionId === "string"
      ) {
        return action.payload.sessionId;
      }
    // Fall through
    case ActionTypes.LOGOUT:
      return null;
    default:
      return state;
  }
}

export function accountId(state = null, action: Actions) {
  switch (action.type) {
    case ActionTypes.LOGIN:
    case ActionTypes.SIGNUP:
    case ActionTypes.ACCOUNT_ID:
      if (
        typeof action.payload === "object" &&
        typeof action.payload.accountId === "string"
      ) {
        return action.payload.accountId;
      }
      return null;
    case ActionTypes.LOGOUT:
    default:
      return state;
  }
}

export function email(state = null, action: Actions) {
  switch (action.type) {
    case ActionTypes.LOGIN:
      if (
        typeof action.payload === "object" &&
        typeof action.payload.email === "string"
      ) {
        return action.payload.email;
      }
      return null;
    case ActionTypes.EMAIL:
      return action.payload;
    case ActionTypes.LOGOUT:
    default:
      return state;
  }
}

export function refreshToken(state = null, action: Actions) {
  switch (action.type) {
    case ActionTypes.LOGIN:
      if (
        typeof action.payload === "object" &&
        typeof action.payload.refreshToken === "string"
      ) {
        return action.payload.refreshToken;
      }
    // Fall through
    case ActionTypes.LOGOUT:
    case ActionTypes.EXPIRED_REFRESH_TOKEN:
      return null;
    default:
      return state;
  }
}

export function refreshTokenExpire(state = null, action: Actions) {
  switch (action.type) {
    case ActionTypes.LOGIN:
      if (
        typeof action.payload === "object" &&
        typeof action.payload.refreshTokenExpire === "number"
      ) {
        return action.payload.refreshTokenExpire;
      }
    // Fall through
    case ActionTypes.LOGOUT:
    case ActionTypes.EXPIRED_REFRESH_TOKEN:
      return null;
    default:
      return state;
  }
}

export function accessToken(state = null, action: Actions) {
  switch (action.type) {
    case ActionTypes.LOGIN:
    case ActionTypes.REFRESH_SESSION:
      if (
        typeof action.payload === "object" &&
        typeof action.payload.accessToken === "string"
      ) {
        return action.payload.accessToken;
      }
    // Fall Through
    case ActionTypes.LOGOUT:
    case ActionTypes.EXPIRED_ACCESS_TOKEN:
      return null;
    default:
      return state;
  }
}

export function accessTokenExpire(state = null, action: Actions) {
  switch (action.type) {
    case ActionTypes.LOGIN:
    case ActionTypes.REFRESH_SESSION:
      if (
        typeof action.payload === "object" &&
        typeof action.payload.accessTokenExpire === "number"
      ) {
        return action.payload.accessTokenExpire;
      }
    // Fall Through
    case ActionTypes.LOGOUT:
    case ActionTypes.EXPIRED_ACCESS_TOKEN:
      return null;
    default:
      return state;
  }
}

export function productId(state = null, action: Actions) {
  switch (action.type) {
    case ActionTypes.PRODUCT_ID:
      return action.payload;
    default:
      return state;
  }
}

export function pass(state = null, action: Actions) {
  switch (action.type) {
    case ActionTypes.PASS:
      return action.payload;
    default:
      return state;
  }
}
export function passes(state = null, action: Actions) {
  switch (action.type) {
    case ActionTypes.PASSES:
      return action.payload;
    default:
      return state;
  }
}

export function locale(state = getDefaultLanguageCode(), action: Actions) {
  switch (action.type) {
    case ActionTypes.LOCALE:
      return action.payload;
    default:
      return state;
  }
}

// Testing
export function fakeNonce(state = "", action: Actions) {
  switch (action.type) {
    case ActionTypes.FAKE_NONCE:
      return action.payload;
    default:
      return state;
  }
}

export function unstableConnection(state = false, action: Actions) {
  switch (action.type) {
    case ActionTypes.SIMULATE_UNSTABLE_CONNECTION:
      return action.payload;
    default:
      return state;
  }
}

export function verificationToken(state = null, action: Actions) {
  switch (action.type) {
    case ActionTypes.VERIFICATION_TOKEN:
      if (
        typeof action.payload === "object" &&
        typeof action.payload.verificationToken === "string"
      ) {
        return action.payload.verificationToken;
      }
      return null;
    default:
      return state;
  }
}

export const account = combineReducers({
  accessToken,
  accessTokenExpire,
  accountId,
  email,
  locale,
  pass,
  passes,
  productId,
  refreshToken,
  refreshTokenExpire,
  sessionId,
  verificationToken,
  // Testing
  // tslint:disable:object-literal-sort-keys
  unstableConnection,
  // tslint:enable:object-literal-sort-keys
});
