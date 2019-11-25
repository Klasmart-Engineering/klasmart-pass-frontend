import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import { redirectIfAuthorized } from "../components/authorized";
import BadanamuButton from "../components/button";
import BadanamuTextField from "../components/textfield";
import BadanamuLogo from "../img/badanamu_logo.png";
import { useRestAPI } from "../restapi";
import { RestAPIError, RestAPIErrorType } from "../restapi_errors";
import { getIdentityType, IdentityType } from "../utils/accountType";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) => createStyles({
    card: {
        display: "flex",
        alignItems: "center",
        padding: "48px 40px !important",
    },
    links: {
        padding: theme.spacing(4, 0),
        textAlign: "right",
    },
    formContainer: {
        width: "100%",
    },
}),
);
// tslint:enable:object-literal-sort-keys

export function Signup() {
    const [inFlight, setInFlight] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [passwordError, setPasswordError] = useState<JSX.Element | null>(null);
    const [emailError, setEmailError] = useState<JSX.Element | null>(null);
    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);

    const classes = useStyles();
    const history = useHistory();
    const restApi = useRestAPI();

    redirectIfAuthorized();

    async function signup(e: React.FormEvent) {
        e.preventDefault();
        if (inFlight) { return; }
        if (email === "") { return; }
        if (password === "") { return; }
        const accountType = getIdentityType(email);
        if (accountType === undefined) { return; }
        try {
            setInFlight(true);
            // TODO: Get Locale
            await restApi.signup(email, password, "en");
            switch (accountType) {
                case IdentityType.Email:
                    history.push("/verify-email");
                    break;
                case IdentityType.Phone:
                    history.push("/verify-phone");
                    break;
                default:
                    throw new Error("Unknown Account Type");
            }
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
            case RestAPIErrorType.EMAIL_ALREADY_USED:
            case RestAPIErrorType.INVALID_EMAIL_FORMAT:
            case RestAPIErrorType.INVALID_EMAIL_HOST:
                setEmailError(errorMessage);
                break;
            case RestAPIErrorType.PASSWORD_LOWERCASE_MISSING:
            case RestAPIErrorType.PASSWORD_NUMBER_MISSING:
            case RestAPIErrorType.PASSWORD_TOO_LONG:
            case RestAPIErrorType.PASSWORD_TOO_SHORT:
            case RestAPIErrorType.PASSWORD_UPPERCASE_MISSING:
                setPasswordError(errorMessage);
                break;
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
                                    id="create_account"
                                    values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }}
                                />
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.formContainer}>
                            <form onSubmit={(e) => signup(e)}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <BadanamuTextField
                                            required
                                            fullWidth
                                            autoComplete="email"
                                            label={<FormattedMessage id="email" />}
                                            value={email}
                                            error={emailError !== null}
                                            helperText={emailError}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <BadanamuTextField
                                            required
                                            fullWidth
                                            type="password"
                                            label={<FormattedMessage id="password" />}
                                            value={password}
                                            error={passwordError !== null}
                                            helperText={passwordError}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <BadanamuTextField
                                            required
                                            fullWidth
                                            value={passwordConfirmation}
                                            label={<FormattedMessage id="password_confirmation" />}
                                            type="password"
                                            error={passwordError !== null}
                                            helperText={passwordError}
                                            onChange={(e) => setPasswordConfirmation(e.target.value)}
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
                                                <FormattedMessage id="sign_up_button" />
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
                            <Grid container item xs={12} justify="flex-end">
                                <Grid item>
                                    <Link
                                        href="#"
                                        variant="subtitle2"
                                        onClick={(e: React.MouseEvent) => { history.push("/login"); e.preventDefault(); }}
                                    >
                                        <FormattedMessage id="sign_up_already" />
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Grid container spacing={4} justify="flex-end" className={classes.links}>
                <Grid item xs={2}>
                    <Link
                        href="#"
                        variant="subtitle2"
                    >
                        <FormattedMessage id="login_help" />
                    </Link>
                </Grid>
                <Grid item xs={2}>
                    <Link
                        href="#"
                        variant="subtitle2"
                    >
                        <FormattedMessage id="login_privacy" />
                    </Link>
                </Grid>
                <Grid item xs={2}>
                    <Link
                        href="#"
                        variant="subtitle2"
                    >
                        <FormattedMessage id="login_terms" />
                    </Link>
                </Grid>
            </Grid>
        </Container>
    );
}
