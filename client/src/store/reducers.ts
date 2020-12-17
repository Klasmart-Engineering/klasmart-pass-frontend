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
    default:
      return state;
  }
}

export function accountId(state = null, action: Actions) {
  switch (action.type) {
    case ActionTypes.ACCOUNT_ID:
      if (
        typeof action.payload === "object" &&
        typeof action.payload.accountId === "string"
      ) {
        return action.payload.accountId;
      }
      return null;
    default:
      return state;
  }
}

export function email(state = null, action: Actions) {
  switch (action.type) {
    case ActionTypes.EMAIL:
      return action.payload;
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

export const account = combineReducers({
  accountId,
  email,
  locale,
  productId,
  sessionId,
  // Testing
  // tslint:disable:object-literal-sort-keys
  unstableConnection,
  // tslint:enable:object-literal-sort-keys
});
