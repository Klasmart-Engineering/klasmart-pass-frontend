import { combineReducers, Store } from "redux";
import { Actions } from "./actions";

export const rootReducer = combineReducers({});

export type State = ReturnType<typeof rootReducer>;
export type Store = Store<State, Actions>;
