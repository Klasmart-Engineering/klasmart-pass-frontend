import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import React, { useState } from "react";
import * as ReactDOM from "react-dom";
import { RawIntlProvider } from "react-intl";
import { Provider, useSelector } from "react-redux";
import { HashRouter } from "react-router-dom";
import App from "./app";
import { Dev } from "./components/dev/dev";
import NavBar from "./components/navbar";
import { createDefaultStore, State } from "./store/store";
import { getLanguage } from "./utils/locale";

function ClientSide() {
    const languageCode = useSelector((state: State) => state.account.locale || "");
    const locale = getLanguage(languageCode);
    const [paletteType, setPalette] = useState("light");
    const typography = {
        button: {
            textTransform: "none",
        },
        fontFamily: languageCode === "en" ?
            ["Nanum Gothic", "Open Sans", "Helvetica", "-apple-system", "sans-serif"].join(",") :
            ["Open Sans", "Helvetica", "-apple-system", "sans-serif"].join(","),
        fontWeightLight: 400,
        fontWeightMedium: 400,
        fontWeightRegular: languageCode === "en" ? 400 : 400,
    } as any; // TODO: Seems like a bug in materialUI's types

    const overrides = {};

    let theme = {};
    if (paletteType === "light") {
        theme = createMuiTheme({ overrides, palette: { type: "light" }, typography });
    } else {
        theme = createMuiTheme({ overrides, palette: { type: "dark" }, typography });
    }

    return (
        <RawIntlProvider value={locale}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <NavBar />
                <App />
                {window.location.hostname === "localhost" ? <Dev /> : null}
            </ThemeProvider>
        </RawIntlProvider>
    );
}

async function main() {
    const store = await createDefaultStore();
    const div = document.getElementById("app");
    ReactDOM.render(
        <HashRouter>
            <Provider store={store}>
                <ClientSide />
            </Provider>
        </HashRouter>,
        div);
}

main();
