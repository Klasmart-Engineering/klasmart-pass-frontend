import { combineReducers } from "@reduxjs/toolkit";

import account from "./slices/account";
import pass from "./slices/pass";
import { fakeNonce, postAuthorizationRoute } from "./reducers";

const rootReducer = combineReducers({
  account,
  pass,
  postAuthorizationRoute,
  fakeNonce,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
