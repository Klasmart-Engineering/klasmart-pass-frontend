import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import account from "./slices/account";
import pass from "./slices/pass";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["account"],
};

const rootReducer = combineReducers({
  account,
  pass,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

export default persistedReducer;
