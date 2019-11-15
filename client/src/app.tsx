import Box from "@material-ui/core/Box";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import { useState } from "react";
import * as React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { isLoggedIn } from "./components/authorized";
import Copyright from "./components/copyright";
import { Introduction } from "./pages/introduction";
import { Landing } from "./pages/landing";
import { Login } from "./pages/login";
import { Payment } from "./pages/payment";
import { Signup } from "./pages/signup";
import { Verify } from "./pages/verify";
import { VerifyLink } from "./pages/verify-link";
import { useRestAPI } from "./restapi";
;

const drawerWidth = 240;

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
        },
        appBar: {
            transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: "none",
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: "flex",
            alignItems: "center",
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar,
            justifyContent: "flex-end",
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: 0,
        },
        contentShift: {
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: -drawerWidth,
        },
    }),
);
// tslint:enable:object-literal-sort-keys

export function App() {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [logoutInFlight, setLogoutInFlight] = useState(false);

    const history = useHistory();
    const api = useRestAPI();

    return (
        <main className={clsx(classes.content, { [classes.contentShift]: open })}>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
                <Route path="/verify" component={Verify} />
                <Route path="/verify_email" component={VerifyLink} />
                <Route path="/payment" component={Payment} />
                <Route path="/introduction" component={Introduction} />
                <Route path="/" component={Landing} />
            </Switch>
            <Box mt={5}>
                <Copyright />
            </Box>
        </main>
    );
}

export default App;
