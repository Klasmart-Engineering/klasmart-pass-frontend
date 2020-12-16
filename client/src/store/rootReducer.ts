import { combineReducers } from "@reduxjs/toolkit";

import account from "./slices/account";
import { fakeNonce, postAuthorizationRoute } from "./reducers";

const rootReducer = combineReducers({
  account,
  postAuthorizationRoute,
  fakeNonce,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
