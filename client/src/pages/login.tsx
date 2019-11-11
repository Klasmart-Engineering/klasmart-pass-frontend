import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl/FormControl";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { redirectIfAuthorized } from "../components/authorized";
import BadanamuButton from "../components/button";
import BadanamuTextField from "../components/textfield";
import { useRestAPI } from "../restapi";
import { RestAPIError, RestAPIErrorType } from "../restapi_errors";
import { State } from "../store/store";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme) => createStyles({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
}),
);
// tslint:enable:object-literal-sort-keys

export function Login() {
    const classes = useStyles();
    const [inFlight, setInFlight] = useState(false);

    const defaultEmail = useSelector((state: State) => state.account.email || "");
    const [email, setEmail] = useState(defaultEmail);
    const [password, setPassword] = useState("");

    const [passwordError, setPasswordError] = useState<JSX.Element | null>(null);
    const [emailError, setEmailError] = useState<JSX.Element | null>(null);
    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);

    const history = useHistory();
    const restApi = useRestAPI();

    redirectIfAuthorized();

    async function loginClick() {
        if (inFlight) { return; }
        if (defaultEmail === "") { return; }
        if (password === "") { return; }
        try {
            setInFlight(true);
            await restApi.login(defaultEmail, password);
            redirectIfAuthorized();
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
                history.push("/verify");
                break;
            case RestAPIErrorType.ACCOUNT_BANNED:
            default:
                setGeneralError(errorMessage);
                break;
        }
    }

    return (
        <Container component="main" maxWidth="xs" >
            <CssBaseline />
            <div className={classes.paper}>
                <img src="https://static-2-badanamu.akamaized.net/wp-content/uploads/2017/04/cropped-Badanamu-PNG-2.png" style={{ marginBottom: 12 }} />
                <Typography component="h1" variant="h5">
                    <FormattedMessage
                        id={"log_into_account"}
                        values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }}
                    />
                </Typography>
                <FormControl className={classes.form} >
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
                    <BadanamuButton
                        fullWidth
                        size="large"
                        disabled={inFlight}
                        onClick={() => loginClick()}
                    >
                        {
                            inFlight ?
                                <CircularProgress size={25} /> :
                                <FormattedMessage id="login_button" />
                        }
                    </BadanamuButton>
                    {
                        generalError === null ? null :
                            <Typography color="error">
                                {generalError}
                            </Typography>
                    }
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link
                                href="#"
                                variant="body2"
                                onClick={(e: React.MouseEvent) => { history.push("/signup"); e.preventDefault(); }}
                            >
                                <FormattedMessage id="login_new_user" />
                            </Link>
                        </Grid>
                    </Grid>
                </FormControl>
            </div>
        </Container>
    );
}
