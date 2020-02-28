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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
    }),
);

export function App() {
    const classes = useStyles();

    return (
        <Grid
            container
            className={classes.content}
            direction="column"
            justify="space-between"
            alignItems="center"
        >
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
            <Grid container className={classes.footer}>
                <Copyright />
            </Grid>
        </Grid>
    );
}

export default App;
