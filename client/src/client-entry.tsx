import React, { useState } from "react";
import * as ReactDOM from "react-dom";
import { RawIntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./app";
import { getIntl } from "./locale/locale";
import { createDefaultStore } from "./store/store";

const locales = [getIntl("ko"), getIntl("en"), getIntl("id")];
const store = createDefaultStore();
function ClientSide() {
    const targetDelay = 3000;
    const firstIndex = Math.floor(Date.now() / targetDelay) % locales.length;
    const [index, setIndex] = useState(firstIndex);
    const delay = targetDelay - (Date.now() % targetDelay);
    setTimeout(() => setIndex((prevousIndex) => (prevousIndex + 1) % locales.length), delay);
    return (
        <HashRouter>
            <Provider store={store}>
                <RawIntlProvider value={locales[index]}>
                    <App />
                </RawIntlProvider>
            </Provider>
        </HashRouter>
    );
}

const div = document.getElementById("app");
ReactDOM.render(<ClientSide />, div);
