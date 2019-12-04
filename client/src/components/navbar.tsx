import { CircularProgress, Typography } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LanguageIcon from "@material-ui/icons/Translate";
import { useState } from "react";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useStore } from "react-redux";
import { useHistory } from "react-router-dom";
import Logo from "../img/logo_learning_pass_header.png";
import { useRestAPI } from "../restapi";
import { ActionTypes } from "../store/actions";
import { State } from "../store/store";
import { isLoggedIn } from "./authorized";

const LANGUAGES_LABEL = [
    {
        code: "en",
        text: "English",
    },
    {
        code: "ko",
        text: "한국어",
    },
];

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        grow: {
            flexGrow: 1,
        },
        appBar: {
            backgroundColor: "transparent",
            color: theme.palette.type === "light" ? "black" : "white",
        },
        appBarBtn: {
            margin: "0 10px",
        },
        accountMenuBtn: {
            borderRadius: 20,
        },
        language: {
            margin: theme.spacing(0, 0.5, 0, 1),
            display: "none",
            [theme.breakpoints.up("md")]: {
                display: "block",
            },
        },
        vl: {
            borderLeft: "2px solid black",
            height: 30,
        },
        logo: {
            height: 48,
            [theme.breakpoints.down("sm")]: {
                height: 36,
            },
        },
        accountMenu: {
            maxWidth: 256,
            padding: theme.spacing(1),
            textAlign: "center",
        },
    }),
);

const StyledMenu = withStyles({})((props: MenuProps) => (
    <Menu
        elevation={4}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "center",
        }}
        {...props}
    />
));

export default function NavBar() {
    const classes = useStyles();
    const store = useStore();

    const locale = useSelector((state: State) => state.account.locale || "");
    const defaultEmail = useSelector((state: State) => state.account.email || "");
    const [logoutInFlight, setLogoutInFlight] = useState(false);
    const [languageMenuElement, setLanguageMenuElement] = useState<null | HTMLElement>(null);
    const [accountMenuElement, setAccountMenuElement] = useState<null | HTMLElement>(null);

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
                        <img src={Logo} className={classes.logo} />
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
                                <FormattedMessage id="LocaleName" />
                            </span>
                            <ExpandMoreIcon fontSize="small" />
                        </Button>
                    </Tooltip>
                    <StyledMenu
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
                    </StyledMenu>
                    <div className={classes.vl}></div>
                    {
                        authorized ?
                            <React.Fragment>
                                <Hidden only="xs">
                                    <Button
                                        color="inherit"
                                        className={classes.appBarBtn}
                                        onClick={() => history.push("/login")}
                                    >
                                        <FormattedMessage id="navbar_signin" />
                                    </Button>
                                </Hidden>
                                <Hidden smUp>
                                    <IconButton
                                        color="inherit"
                                        className={classes.appBarBtn}
                                        onClick={() => history.push("/login")}
                                    >
                                        <AccountCircleRoundedIcon id="navbar_signin" />
                                    </IconButton>
                                </Hidden>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <Hidden only="xs">
                                    <Button
                                        color="inherit"
                                        className={classes.appBarBtn}
                                        onClick={() => history.push("/my-account")}
                                    >
                                        <FormattedMessage id="navbar_my_account" />
                                    </Button>
                                    <Button
                                        color="inherit"
                                        className={classes.appBarBtn}
                                        disabled={logoutInFlight}
                                        onClick={() => logout()}
                                    >
                                        {
                                            logoutInFlight ?
                                                <CircularProgress size={15} /> :
                                                <FormattedMessage id="navbar_signout" />
                                        }
                                    </Button>
                                </Hidden>
                                <Hidden smUp>
                                    <Tooltip title="My Account" enterDelay={300}>
                                        <Button
                                            color="inherit"
                                            aria-owns={accountMenuElement ? "my-account" : undefined}
                                            aria-haspopup="true"
                                            className={classes.appBarBtn}
                                            data-ga-event-category="AppBar"
                                            data-ga-event-action="account"
                                            onClick={(e) => setAccountMenuElement(e.currentTarget)}
                                        >
                                            <AccountCircleRoundedIcon />
                                            <ExpandMoreIcon fontSize="small" />
                                        </Button>
                                    </Tooltip>
                                    <StyledMenu
                                        id="my-account"
                                        anchorEl={accountMenuElement}
                                        keepMounted
                                        open={Boolean(accountMenuElement)}
                                        onClose={() => setAccountMenuElement(null)}
                                    >
                                        {
                                            <Grid container spacing={2} className={classes.accountMenu}>
                                                <Grid item xs={12}>
                                                    <Typography variant="caption">
                                                        {defaultEmail}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button
                                                        color="inherit"
                                                        variant="outlined"
                                                        fullWidth
                                                        className={classes.accountMenuBtn}
                                                        onClick={() => {
                                                            history.push("/my-account")
                                                            setAccountMenuElement(null)
                                                        }}
                                                    >
                                                        <FormattedMessage id="navbar_my_account" />
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button
                                                        color="inherit"
                                                        variant="outlined"
                                                        fullWidth
                                                        className={classes.accountMenuBtn}
                                                        disabled={logoutInFlight}
                                                        onClick={() => {
                                                            logout()
                                                            setAccountMenuElement(null)
                                                        }}
                                                    >
                                                        {
                                                            logoutInFlight ?
                                                                <CircularProgress size={15} /> :
                                                                <FormattedMessage id="navbar_signout" />
                                                        }
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        }
                                    </StyledMenu>
                                </Hidden>
                            </React.Fragment>
                    }
                </Toolbar>
            </AppBar>
        </nav>
    );
}
