import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import EmailIcon from "@material-ui/icons/Email";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import MenuIcon from "@material-ui/icons/Menu";
import PaymentIcon from "@material-ui/icons/Payment";
import LogoutIcon from "@material-ui/icons/PowerSettingsNew";
import LanguageIcon from "@material-ui/icons/Translate";
import clsx from "clsx";
import { useState } from "react";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useStore } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import { Landing } from "../pages/landing";
import { Login } from "../pages/login";
import { Payment } from "../pages/payment";
import { Signup } from "../pages/signup";
import { Verify } from "../pages/verify";
import { useRestAPI } from "../restapi";
import { ActionTypes } from "../store/actions";
import { State } from "../store/store";
import { isLoggedIn } from "./authorized";
import Copyright from "./copyright";

const drawerWidth = 240;
const LANGUAGES_LABEL = [
    {
        code: "en",
        text: "English",
    },
    {
        code: "ko",
        text: "Korean",
    },
    {
        code: "id",
        text: "Indonesian",
    },
    {
        code: "vi",
        text: "Vietnamese",
    },
];

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
        },
        grow: {
            flexGrow: 1,
        },
        appBar: {
            backgroundColor: "white",
            color: "black",
        },
        appBarBtn: {
            fontSize: 19,
            margin: "0 10px",
        },
        language: {
            margin: theme.spacing(0, 0.5, 0, 1),
            display: "none",
            [theme.breakpoints.up("md")]: {
                display: "block",
            },
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
        vl: {
            borderLeft: "2px solid black",
            height: 30,
        },
    }),
);

export default function NavBar() {
    const classes = useStyles();
    const store = useStore();

    const locale = useSelector((state: State) => state.account.locale || "");
    const [logoutInFlight, setLogoutInFlight] = useState(false);
    const [languageMenuElement, setLanguageMenuElement] = useState<null | HTMLElement>(null);

    const history = useHistory();
    const api = useRestAPI();
    const authorized = isLoggedIn();

    function languageSelect(code: string) {
        store.dispatch({ type: ActionTypes.LOCALE, payload: code });
        setLanguageMenuElement(null);
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
        <nav>
            <AppBar
                elevation={1}
                position="static"
                className={classes.appBar}
            >
                <Toolbar>
                    <Button color="inherit" onClick={() => history.push("/")}>
                        <img src="https://static-2-badanamu.akamaized.net/wp-content/uploads/2017/04/cropped-Badanamu-PNG-2.png" style={{ height: 50, marginRight: 8 }} />
                        <Typography variant="h4" className={classes.language} noWrap>
                            Learning Pass
                        </Typography>
                    </Button>
                    <div className={classes.grow} />
                    <Tooltip title="Change Language" enterDelay={300}>
                        <Button
                            color="inherit"
                            aria-owns={languageMenuElement ? "language-menu" : undefined}
                            aria-haspopup="true"
                            className={classes.appBarBtn}
                            data-ga-event-category="AppBar"
                            data-ga-event-action="language"
                            onClick={(e) => setLanguageMenuElement(e.currentTarget)}
                        >
                            <LanguageIcon />
                            <span className={classes.language}>
                                {LANGUAGES_LABEL.filter((language) => language.code === locale)[0].text}
                            </span>
                            <ExpandMoreIcon fontSize="small" />
                        </Button>
                    </Tooltip>
                    <Menu
                        id="language-menu"
                        anchorEl={languageMenuElement}
                        keepMounted
                        open={Boolean(languageMenuElement)}
                        onClose={() => setLanguageMenuElement(null)}
                    >
                        {
                            LANGUAGES_LABEL.map((language) => (
                                <MenuItem
                                    key={language.code}
                                    selected={locale === language.code}
                                    onClick={() => languageSelect(language.code)}
                                >
                                    {language.text}
                                </MenuItem>
                            ))
                        }
                    </Menu>
                    <div className={classes.vl}></div>
                    {
                        authorized ?
                            <Button
                                color="inherit"
                                className={classes.appBarBtn}
                                onClick={() => history.push("/login")}
                            >
                                Sign  In
                            </Button> :
                            <Button
                                color="inherit"
                                className={classes.appBarBtn}
                                onClick={() => logout()}
                            >
                                Sign Out
                            </Button>
                    }
                </Toolbar>
            </AppBar>
        </nav>
    );
}
