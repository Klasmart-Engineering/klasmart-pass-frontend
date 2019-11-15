import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import PaymentIcon from "@material-ui/icons/Payment";
import LogoutIcon from "@material-ui/icons/PowerSettingsNew";
import RefreshIcon from "@material-ui/icons/Refresh";
import { useState } from "react";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import { useRestAPI } from "../../restapi";
import AccountInfo from "./accountInfo";

const drawerWidth = 350;
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

interface Props {
    open: boolean;
    setOpen: (open: boolean) => any;
}
export function DeveloperDrawer(props: Props) {
    const classes = useStyles();

    const [logoutInFlight, setLogoutInFlight] = useState(false);
    const [refreshInFlight, setRefreshInFlight] = useState(false);

    const history = useHistory();
    const api = useRestAPI();

    function navigate(path: string) {
        if (open) { props.setOpen(false); }
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

    async function refresh() {
        if (refreshInFlight) { return; }
        try {
            setRefreshInFlight(true);
            await api.refreshSession();
        } finally {
            setRefreshInFlight(false);
        }
    }

    return (
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={props.open}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.drawerHeader}>
                <IconButton onClick={() => props.setOpen(false)}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <Divider />
            <List>
                <ListItem
                    button
                    selected={history.location.pathname === "/"}
                    onClick={() => navigate("/")}
                >
                    <ListItemIcon>
                        <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage id="sign_up" />} />
                </ListItem>
                <ListItem
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
                    onClick={() => refresh()}
                >
                    <ListItemIcon>
                        {refreshInFlight ? <CircularProgress size={25} /> : <RefreshIcon />}
                    </ListItemIcon>
                    <ListItemText primary="refresh" />
                </ListItem>
                <ListItem
                    button
                    selected={history.location.pathname === "/password-change"}
                    onClick={() => navigate("/password-change")}
                >
                    <ListItemIcon>
                        <LockIcon />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage id="password_change" />} />
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
                <ListItem
                    button
                    selected={history.location.pathname === "/verify"}
                    onClick={() => navigate("/verify")}
                >
                    <ListItemIcon>
                        <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage id="verify_email" />} />
                </ListItem>
            </List>
            <Divider />
            <AccountInfo />
        </Drawer>
    );
}
