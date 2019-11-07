import Cookies from "cookies-js";
import { combineReducers, createStore, Store } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { CookieStorage } from "redux-persist-cookie-storage";
import { Actions } from "./actions";
import {account} from "./reducers";

export const rootReducer = combineReducers({account});

export function createDefaultStore() {
    const persistConfig = {
        key: "root",
        storage: new CookieStorage(Cookies),
      };
    const persistedReducer = persistReducer(persistConfig, rootReducer);
    const store = createStore(persistedReducer);
    const persistor = persistStore(store, {});
    return store;
}
export type State = ReturnType<typeof rootReducer>;
export type Store = Store<State, Actions>;
