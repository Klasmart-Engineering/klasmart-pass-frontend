import { combineReducers } from "@reduxjs/toolkit";

import loginReducer from "./slices/loginSlice";
import languageReducer from "./slices/langSlice";
import globalDialogReducer from "./slices/globalDialogSlice";
import account from "./slices/account";
import { fakeNonce, postAuthorizationRoute } from "../store/reducers";

const rootReducer = combineReducers({
  login: loginReducer,
  language: languageReducer,
  globalDialog: globalDialogReducer,
  account,
  postAuthorizationRoute,
  fakeNonce,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
