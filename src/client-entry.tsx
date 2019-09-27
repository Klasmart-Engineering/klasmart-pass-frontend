import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from "redux";
import { App } from "./app";
import { RestAPI } from "./restapi";
import { rootReducer } from "./store/store";

const div = document.getElementById("app");

const store = createStore(rootReducer);
ReactDOM.render(<App store={store}/>, div);
