import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import LogRocket from "logrocket";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useStore } from "react-redux";
import { useHistory } from "react-router";
import { redirectIfAuthorized } from "../components/authorized";
import BadanamuButton from "../components/button";
import PolicyLink from "../components/policyLinks";
import BadanamuTextField from "../components/textfield";
import BadanamuLogo from "../img/badanamu_logo.png";
import { useRestAPI } from "../restapi";
import { RestAPIError, RestAPIErrorType } from "../restapi_errors";
import { ActionTypes } from "../store/actions";
import { State } from "../store/store";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme) => createStyles({
    card: {
        display: "flex",
        alignItems: "center",
        padding: "48px 40px !important",
    },
    link: {
        textAlign: "right",
        [theme.breakpoints.down("sm")]: {
            paddingTop: theme.spacing(2),
            textAlign: "left",
        },
    },
    formContainer: {
        width: "100%",
    },
}),
);
// tslint:enable:object-literal-sort-keys

export function Login() {
    const classes = useStyles();
    const [inFlight, setInFlight] = useState(false);

    const defaultEmail = useSelector((state: State) => state.account.email || "");
    const passes = useSelector((state: State) => state.account.passes || []);
    const [email, setEmail] = useState(defaultEmail);
    const [password, setPassword] = useState("");

    const [passwordError, setPasswordError] = useState<JSX.Element | null>(null);
    const [emailError, setEmailError] = useState<JSX.Element | null>(null);
    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);

    const store = useStore();
    const history = useHistory();
    const restApi = useRestAPI();

    redirectIfAuthorized();

    async function login(e: React.FormEvent) {
        e.preventDefault();
        if (inFlight) { return; }
        if (email === "") { return; }
        if (password === "") { return; }
        try {
            setInFlight(true);
            await restApi.login(email, password);
            const { passes: newPasses } = await restApi.getPassAccesses();
            store.dispatch({ type: ActionTypes.PASSES, payload: newPasses });
            LogRocket.identify(email);
        } catch (e) {
            handleError(e);
        } finally {
            setInFlight(false);
        }
    }

    function handleError(e: RestAPIError | Error) {
        if (!(e instanceof RestAPIError)) {
            console.error(e);
            return;
        }
        const id = e.getErrorMessageID();
        const errorMessage = <FormattedMessage id={id} />;
        switch (e.getErrorMessageType()) {
            case RestAPIErrorType.INVALID_LOGIN:
                setEmailError(errorMessage);
                break;
            case RestAPIErrorType.INVALID_PASSWORD:
                setPasswordError(errorMessage);
                break;
            case RestAPIErrorType.EMAIL_NOT_VERIFIED:
                history.push("/verify-email");
                break;
            case RestAPIErrorType.EMAIL_NOT_VERIFIED:
                history.push("/verify-phone");
                break;
            case RestAPIErrorType.ACCOUNT_BANNED:
            default:
                setGeneralError(errorMessage);
                break;
        }
    }

    return (
        <Container maxWidth="sm" style={{ margin: "auto 0" }}>
            <Card>
                <CardContent className={classes.card}>
                    <Grid container direction="column" justify="center" alignItems="center" spacing={4}>
                        <Grid item xs={12}>
                            <img src={BadanamuLogo} style={{ marginBottom: 12 }} />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5">
                                <FormattedMessage
                                    id={"log_into_account"}
                                    values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }}
                                />
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.formContainer}>
                            <form onSubmit={(e) => login(e)} >
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <BadanamuTextField
                                            required
                                            fullWidth
                                            value={email}
                                            label={<FormattedMessage id="email" />}
                                            autoComplete="email"
                                            error={emailError !== null}
                                            helperText={emailError}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <BadanamuTextField
                                            required
                                            fullWidth
                                            value={password}
                                            label={<FormattedMessage id="password" />}
                                            type="password"
                                            error={passwordError !== null}
                                            helperText={passwordError}
                                            autoComplete="current-password"
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <BadanamuButton
                                        fullWidth
                                        type="submit"
                                        size="large"
                                        disabled={inFlight}
                                    >
                                        {
                                            inFlight ?
                                                <CircularProgress size={25} /> :
                                                <FormattedMessage id="login_button" />
                                        }
                                    </BadanamuButton>
                                </Grid>
                                <Grid item xs={12}>
                                    {
                                        generalError === null ? null :
                                            <Typography color="error">
                                                {generalError}
                                            </Typography>
                                    }
                                </Grid>
                            </form>
                            <Grid container justify="space-between">
                                <Grid item xs={12} sm={6}>
                                    <Link
                                        href="#"
                                        variant="subtitle2"
                                        onClick={(e: React.MouseEvent) => { history.push("/password-forgot"); e.preventDefault(); }}
                                    >
                                        <FormattedMessage id="login_forgot_password" />
                                    </Link>
                                </Grid>
                                <Grid item xs={12} sm={6} className={classes.link}>
                                    <Link
                                        href="#"
                                        variant="subtitle2"
                                        onClick={(e: React.MouseEvent) => { history.push("/signup"); e.preventDefault(); }}
                                    >
                                        <FormattedMessage id="login_new_user" />
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <PolicyLink />
        </Container>
    );
}
