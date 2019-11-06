import React, { useState } from "react";
import * as ReactDOM from "react-dom";
import { RawIntlProvider } from "react-intl";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./app";
import { getIntl } from "./locale/locale";

const div = document.getElementById("app");

const locales = [getIntl("ko"), getIntl("en")];
function ClientSide() {
    const [index, setIndex] = useState(0);
    setTimeout(() => setIndex((index + 1) % locales.length), 3000);
    return (
        <HashRouter>
            <RawIntlProvider value={locales[index]}>
                <App />
            </RawIntlProvider>
        </HashRouter>
    );
}

ReactDOM.render(<ClientSide />, div);
