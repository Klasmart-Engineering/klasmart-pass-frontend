import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import EmailIcon from "@material-ui/icons/Email";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import MenuIcon from "@material-ui/icons/Menu";
import PaymentIcon from "@material-ui/icons/Payment";
import LogoutIcon from "@material-ui/icons/PowerSettingsNew";
import clsx from "clsx";
import { useState } from "react";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Route, Switch, useHistory } from "react-router-dom";
import AccountInfo from "./components/accountInfo";
import { isLoggedIn } from "./components/authorized";
import Copyright from "./components/copyright";
import { Landing } from "./pages/landing";
import { Login } from "./pages/login";
import { Payment } from "./pages/payment";
import { Signup } from "./pages/signup";
import { Verify } from "./pages/verify";
import { useRestAPI } from "./restapi";

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
    const authorized = isLoggedIn();

    function navigate(path: string) {
        if (open) { setOpen(false); }
        history.push(path);
    }

    async function logout() {
        if (logoutInFlight) { return; }
        try {
            setLogoutInFlight(true);
            await api.endSession();
        } finally {
            setLogoutInFlight(false);
        }
    }

    return (
        <div >
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, { [classes.appBarShift]: open })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setOpen(true)}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Badanamu
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={() => setOpen(false)}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem
                        className={clsx({ [classes.hide]: !authorized })}
                        button
                        selected={history.location.pathname === "/signup"}
                        onClick={() => navigate("/signup")}
                    >
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary={<FormattedMessage id="sign_up" />} />
                    </ListItem>
                    <ListItem
                        className={clsx({ [classes.hide]: !authorized })}
                        button
                        selected={history.location.pathname === "/login"}
                        onClick={() => navigate("/login")}
                    >
                        <ListItemIcon>
                            <LockOpenIcon />
                        </ListItemIcon>
                        <ListItemText primary={<FormattedMessage id="login" />} />
                    </ListItem>
                    <ListItem
                        className={clsx({ [classes.hide]: authorized })}
                        button
                        onClick={() => logout()}
                    >
                        <ListItemIcon>
                            {logoutInFlight ? <CircularProgress size={25} /> : <LogoutIcon />}
                        </ListItemIcon>
                        <ListItemText primary={<FormattedMessage id="logout" />} />
                    </ListItem>
                    <ListItem
                        button
                        selected={history.location.pathname === "/payment"}
                        onClick={() => navigate("/payment")}
                    >
                        <ListItemIcon>
                            <PaymentIcon />
                        </ListItemIcon>
                        <ListItemText primary={<FormattedMessage id="payment" />} />
                    </ListItem>
                </List>
                <Divider />
            </Drawer>
            <main className={clsx(classes.content, { [classes.contentShift]: open })}>
                <div className={classes.drawerHeader} />
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />
                    <Route path="/verify" component={Verify} />
                    <Route path="/payment" component={Payment} />
                    <Route path="/" component={Landing} />
                </Switch>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </main>
        </div>
    );
}

export default App;
