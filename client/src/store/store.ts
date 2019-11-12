import Cookies from "cookies-js";
import { combineReducers, createStore, Store } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { CookieStorage } from "redux-persist-cookie-storage";
import { Actions } from "./actions";
import { account, postAuthorizationRoute } from "./reducers";

const persistConfig = {
  key: "root",
  storage: new CookieStorage(Cookies),
};
const accountPersisted = persistReducer(persistConfig, account);
const rootReducer = combineReducers({ account: accountPersisted, postAuthorizationRoute });

export async function createDefaultStore() {
  return new Promise<Store>((resolve) => {
    const store = createStore(rootReducer);
    const persistor = persistStore(store, {}, () => resolve(store));
  });
}
export type State = ReturnType<typeof rootReducer>;
export type Store = Store<State, Actions>;
