import { combineReducers, createStore, Store } from "redux";
import { Actions } from "./actions";
import {accessToken, accountID, deviceID, email, refreshToken} from "./reducers";

export const persistent = combineReducers({
    accessToken,
    accountID,
    deviceID,
    email,
    refreshToken,
});
export const rootReducer = combineReducers({persistent});

export type State = ReturnType<typeof rootReducer>;
export type Store = Store<State, Actions>;

export function createDefaultStore() {
    return createStore(rootReducer);
}
