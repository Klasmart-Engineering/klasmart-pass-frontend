import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core/styles/createTypography";
import React, { useState } from "react";
import * as ReactDOM from "react-dom";
import { RawIntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./app";
import NavBar from "./components/navbar";
import { getIntl } from "./locale/locale";
import { createDefaultStore } from "./store/store";

async function main() {
    const locales = [getIntl("ko"), getIntl("en"), getIntl("id")];
    const store = await createDefaultStore();
    function ClientSide() {
        const targetDelay = 3000;
        const firstIndex = Math.floor(Date.now() / targetDelay) % locales.length;
        const [index, setIndex] = useState(firstIndex);
        const delay = targetDelay - (Date.now() % targetDelay);
        setTimeout(() => setIndex((prevousIndex) => (prevousIndex + 1) % locales.length), delay);

        const [paletteType, setPalette] = useState("light");
        const typography = {
            button: {
                textTransform: "none",
            },
            fontFamily: index === 1 ?
                ["Nanum Gothic", "Source Sans Pro", "Helvetica", "-apple-system", "sans-serif"].join(",") :
                ["Source Sans Pro", "Helvetica", "-apple-system", "sans-serif"].join(","),
            fontWeightLight: 400,
            fontWeightMedium: 400,
            fontWeightRegular: index === 1 ? 400 : 400,
        } as any; // TODO: Seems like a bug in materialUI's types

        const overrides = {};

        let theme = {};
        if (paletteType === "light") {
            theme = createMuiTheme({ overrides, palette: { type: "light" }, typography });
        } else {
            theme = createMuiTheme({ overrides, palette: { type: "dark" }, typography });
        }

        return (
            <HashRouter>
                <Provider store={store}>
                    <RawIntlProvider value={locales[index]}>
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            <NavBar />
                            <App />
                        </ThemeProvider>
                    </RawIntlProvider>
                </Provider>
            </HashRouter>
        );
    }

    const div = document.getElementById("app");
    ReactDOM.render(<ClientSide />, div);
}

main();
