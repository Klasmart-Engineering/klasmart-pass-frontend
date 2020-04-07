import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { Route, Switch } from "react-router-dom";
import Copyright from "./components/copyright";
import { Introduction } from "./pages/introduction";
import { Landing } from "./pages/landing";
import { Login } from "./pages/login";
import { MyAccount } from "./pages/my-account";
import { PasswordChange } from "./pages/password-change";
import { PasswordChanged } from "./pages/password-changed";
import { PasswordForgot } from "./pages/password-forgot";
import { PasswordRestore } from "./pages/password-restore";
import { Payment } from "./pages/payment";
import { PaymentError } from "./pages/payment-error";
import { PaymentThankyou } from "./pages/payment-thankyou";
import { Signup } from "./pages/signup";
import { Verify } from "./pages/verify";
import { VerifyLink } from "./pages/verify-link";
import { IdentityType } from "./utils/accountType";
import { RedeemTicket } from "./pages/redeem-ticket";
import { RedeemEventTicket } from "./pages/redeem-event-ticket";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ChromeLogo from "./img/browsers/logo-chrome.png";
import EdgeLogo from "./img/browsers/logo-edge.png";
import FireFoxLogo from "./img/browsers/logo-firefox.png";
import OperaLogo from "./img/browsers/logo-opera.png";
import SafariLogo from "./img/browsers/logo-safari.png";
import { applyMiddleware } from "redux";
import { BrowserList } from "./pages/browserList";

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
        }
    }),
);

function detectIE() {
    var ua = window.navigator.userAgent;
    // Test values; Uncomment to check result …
    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
    // Edge 12 (Spartan)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
    // Edge 13
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';
    var msie = ua.indexOf('MSIE ');
    if (msie > 0) { return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10); }
    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
    var edge = ua.indexOf('Edge/');
    if (edge > 0) { return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10); }
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
                        <Route path="/login" component={Login} />
                        <Route path="/signup" component={Signup} />
                        <Route path="/my-account" component={MyAccount} />
                        <Route path="/verify-phone" render={(props) => <Verify type={IdentityType.Phone} {...props} />} />
                        <Route path="/verify-email" render={(props) => <Verify type={IdentityType.Email} {...props} />} />
                        <Route path="/verify_email" component={VerifyLink} />
                        <Route path="/payment" component={Payment} />
                        <Route path="/payment-thankyou" component={PaymentThankyou} />
                        <Route path="/payment-error" component={PaymentError} />
                        <Route path="/introduction" component={Introduction} />
                        <Route path="/password-change" component={PasswordChange} />
                        <Route path="/password-changed" component={PasswordChanged} />
                        <Route path="/password-forgot" component={PasswordForgot} />
                        <Route path="/password-restore" component={PasswordRestore} />
                        <Route path="/redeem-ticket" component={RedeemTicket} />
                        <Route path="/redeem-event-ticket" component={RedeemEventTicket} />
                        <Route path="/" component={Landing} />
                    </Switch>
            }
            <Grid container className={classes.footer}>
                <Copyright />
            </Grid>
        </Grid >
    );
}

export default App;
