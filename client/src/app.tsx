import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { Route, Switch } from "react-router-dom";
import Copyright from "./components/copyright";
import { BrowserList } from "./pages/browserList";
import { PasswordChange } from "./pages/password-change";
import { PasswordChanged } from "./pages/password-changed";
import { PasswordForgot } from "./pages/password-forgot";
import { PasswordRestore } from "./pages/password-restore";
import { Signup } from "./pages/signup";
import { Verify } from "./pages/verify";
import { VerifyLink } from "./pages/verify-link";
import { VerifyLinkToken } from "./pages/verify-link-token";
import { IdentityType } from "./utils/accountType";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            padding: "48px 32px !important",
        },
        content: {
            flexGrow: 1,
            flexWrap: "nowrap",
            padding: "32px 0",
        },
        footer: {
            alignItems: "center",
            padding: theme.spacing(4, 2, 2, 2),
            [theme.breakpoints.down("xs")]: {
                alignItems: "left",
            },
        },
        browserLogo: {
            verticalAlign: "middle",
            display: "table-cell",
            width: 52,
        },
        textLogo: {
            verticalAlign: "middle",
            display: "table-cell",
            textDecoration: "none",
            paddingLeft: 12,
        },
    }),
);

function detectIE() {
    const ua = window.navigator.userAgent;
    // Test values; Uncomment to check result …
    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
    // Edge 12 (Spartan)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
    // Edge 13
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';
    const msie = ua.indexOf("MSIE ");
    if (msie > 0) { return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10); }
    const trident = ua.indexOf("Trident/");
    if (trident > 0) {
        const rv = ua.indexOf("rv:");
        return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
    }
    const edge = ua.indexOf("Edge/");
    if (edge > 0) { return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10); }
    // other browser
    return false;
}

export function App() {
  const classes = useStyles();
  const isIE = detectIE();

    return (
        <Grid
            container
            className={classes.content}
            direction="column"
            justify="space-between"
            alignItems="center"
        >
            {
                (isIE <= 11 && isIE !== false) ?
                    <BrowserList />
                    :
                    <Switch>
                        <Route path="/signup" component={Signup} />
                        <Route path="/verify-phone">
                            <Verify type={IdentityType.Phone} />
                        </Route>
                        <Route path="/verify-email">
                            <Verify type={IdentityType.Email} />
                        </Route>
                        <Route path="/verify_email" component={VerifyLink} />
                        <Route path="/verify_email_with_token" component={VerifyLinkToken} />
                        <Route path="/password-change" component={PasswordChange} />
                        <Route path="/password-changed" component={PasswordChanged} />
                        <Route path="/password-forgot" component={PasswordForgot} />
                        <Route path="/password-restore" component={PasswordRestore} />
                        <Route path="/" component={Signup} />
                    </Switch>
            }
            <Grid container className={classes.footer}>
                <Copyright />
            </Grid>
        </Grid >
    );
}

export default App;
