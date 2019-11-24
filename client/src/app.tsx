import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { Route, Switch } from "react-router-dom";
import Copyright from "./components/copyright";
import { Introduction } from "./pages/introduction";
import { Landing } from "./pages/landing";
import { Login } from "./pages/login";
import { PasswordChange } from "./pages/password-change";
import { PasswordChanged } from "./pages/password-changed";
import { PasswordForgot } from "./pages/password-forgot";
import { PasswordRestore } from "./pages/password-restore";
import { Payment } from "./pages/payment";
import { Signup } from "./pages/signup";
import { Verify } from "./pages/verify";
import { VerifyLink } from "./pages/verify-link";
import { IdentityType } from "./utils/accountType";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            flexGrow: 1,
            padding: "32px 0",
            transition: theme.transitions.create("margin", {
                duration: theme.transitions.duration.leavingScreen,
                easing: theme.transitions.easing.sharp,
            }),
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
            <Box />
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
                <Route path="/verify-phone" render={(props) => <Verify type={IdentityType.Phone} {...props} />} />
                <Route path="/verify-email" render={(props) => <Verify type={IdentityType.Email} {...props} />} />
                <Route path="/verify_email" component={VerifyLink} />
                <Route path="/payment" component={Payment} />
                <Route path="/introduction" component={Introduction} />
                <Route path="/password-change" component={PasswordChange} />
                <Route path="/password-changed" component={PasswordChanged} />
                <Route path="/password-forgot" component={PasswordForgot} />
                <Route path="/password-restore" component={PasswordRestore} />
                <Route path="/" component={Landing} />
            </Switch>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Grid>
    );
}

export default App;
