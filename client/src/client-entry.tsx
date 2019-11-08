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
    const [index, setIndex] = useState(0);
    setTimeout(() => setIndex((prevousIndex) => (prevousIndex + 1) % locales.length), 3000);
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
