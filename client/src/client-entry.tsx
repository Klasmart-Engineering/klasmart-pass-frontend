import blue from "@material-ui/core/colors/blue";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from "@material-ui/core/styles";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import * as QueryString from "query-string";
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
    const params = QueryString.parse(window.location.search);
    const testing = (params.test !== undefined) !== (window.location.hostname === "localhost");
    const languageCode = useSelector((state: State) => state.account.locale || "");
    const locale = getLanguage(languageCode);
    const [paletteType, setPalette] = useState("light");
    const typography = {
        button: {
            textTransform: "none",
        },
        fontFamily: languageCode === "en" ?
            ["Open Sans", "Helvetica", "-apple-system", "sans-serif"].join(",") :
            ["Nanum Gothic", "Open Sans", "Helvetica", "-apple-system", "sans-serif"].join(","),
        fontWeightLight: 400,
        fontWeightMedium: 600,
        fontWeightRegular: languageCode === "en" ? 400 : 400,
        h1: { letterSpacing: "-1.0px" },
        h2: { letterSpacing: "-2.2px" },
        h3: { letterSpacing: "-2.2px" },
        h4: { letterSpacing: "-1.4px" },
        h5: { letterSpacing: "-1.4px" },
        h6: { letterSpacing: "-1.2px" },
    } as any; // TODO: Seems like a bug in materialUI's types

    const overrides = {};
    const palette: PaletteOptions = {
        primary: {
            light: "#0E78D5",
            main: "#0E78D5",
            dark: "#1896ea",
            contrastText: "#fff",
        },
    };

    let theme = {};
    if (paletteType === "light") {
        palette.type = "light";
        palette.background = { default: "white" };
        theme = createMuiTheme({ overrides, palette, typography });
    } else {
        palette.type = "dark";
        theme = createMuiTheme({ overrides, palette, typography });
    }

    return (
        <RawIntlProvider value={locale}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <NavBar />
                <App />
                {testing ? <Dev /> : null}
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
