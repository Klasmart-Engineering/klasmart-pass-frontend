import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import DeleteIcon from "@material-ui/icons/Delete";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import PaymentIcon from "@material-ui/icons/Payment";
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid";
import LogoutIcon from "@material-ui/icons/PowerSettingsNew";
import RefreshIcon from "@material-ui/icons/Refresh";
import { useState } from "react";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { RestAPI, useRestAPI } from "../../restapi";
import { Actions, ActionTypes } from "../../store/actions";
import { State } from "../../store/store";
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
    const history = useHistory();
    const api = useRestAPI();
    const simulateUnstableConnection = useSelector((state: State) => state.account.unstableConnection);
    const dispatch = useDispatch<(action: Actions) => void>();

    function toggleSimulateUnstableConnection() {
        dispatch({
            payload: !simulateUnstableConnection,
            type: ActionTypes.SIMULATE_UNSTABLE_CONNECTION,
        });
    }

    function navigate(path: string) {
        if (open) { props.setOpen(false); }
        history.push(path);
    }

    const [expirePassesInFlight, setExpirePassesInFlight] = useState(false);
    async function expirePasses() {
        if (expirePassesInFlight) { return; }
        try {
            setExpirePassesInFlight(true);
            await api.expirePassAccesses();
        } finally {
            setExpirePassesInFlight(false);
        }
    }

    const [expireProductsInFlight, setExpireProductsInFlight] = useState(false);
    async function expireProducts() {
        if (expireProductsInFlight) { return; }
        try {
            setExpireProductsInFlight(true);
            await api.expireProductAccesses();
        } finally {
            setExpireProductsInFlight(false);
        }
    }

    const [logoutInFlight, setLogoutInFlight] = useState(false);
    async function logout() {
        if (logoutInFlight) { return; }
        try {
            setLogoutInFlight(true);
            await api.endSession();
        } finally {
            setLogoutInFlight(false);
        }
    }

    const [refreshInFlight, setRefreshInFlight] = useState(false);
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

            <FormControlLabel
                control={
                    <Switch checked={simulateUnstableConnection} onChange={() => toggleSimulateUnstableConnection()} />
                }
                label="Simulate Unstable Connection"
            />
            <Divider />
            <List>
                <ListItem
                    button
                    selected={history.location.pathname === "/"}
                    onClick={() => navigate("/signup")}
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
                    selected={history.location.pathname === "/password-forgot"}
                    onClick={() => navigate("/password-forgot")}
                >
                    <ListItemIcon>
                        <LockIcon />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage id="password_forgot" />} />
                </ListItem>
                <ListItem
                    button
                    selected={history.location.pathname === "/password-retore"}
                    onClick={() => navigate("/password-restore")}
                >
                    <ListItemIcon>
                        <LockIcon />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage id="password_restore" />} />
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
                    selected={history.location.pathname === "/payment-error"}
                    onClick={() => navigate("/payment-error")}
                >
                    <ListItemIcon>
                        <PaymentIcon />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage id="payment_error" />} />
                </ListItem>
                <ListItem
                    button
                    selected={history.location.pathname === "/verify-email"}
                    onClick={() => navigate("/verify-email")}
                >
                    <ListItemIcon>
                        <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage id="verify_email" />} />
                </ListItem>
                <ListItem
                    button
                    selected={history.location.pathname === "/verify-phone"}
                    onClick={() => navigate("/verify-phone")}
                >
                    <ListItemIcon>
                        <PhoneAndroidIcon />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage id="verify_phone" />} />
                </ListItem>
            </List>
            <Divider />
            <Button
                variant="contained"
                color="secondary"
                startIcon={expirePassesInFlight ? <CircularProgress size={15} /> : <DeleteIcon />}
                onClick={() => expirePasses()}
            >
                Expire Passes
            </Button>
            <Button
                variant="contained"
                color="secondary"
                startIcon={expireProductsInFlight ? <CircularProgress size={15} /> : <DeleteIcon />}
                onClick={() => expireProducts()}
            >
                Expire Products
            </Button>
            <AccountInfo />
        </Drawer>
    );
}
