import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl/FormControl";
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
import { useRestAPI } from "../restapi";
import { RestAPIError, RestAPIErrorType } from "../restapi_errors";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) => createStyles({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  "paper": {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  "avatar": {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  "form": {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  "submit": {
    margin: theme.spacing(3, 0, 2),
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

  async function signupClick() {
    if (inFlight) { return; }
    if (email === "") { return; }
    if (password === "") { return; }
    try {
      setInFlight(true);
      // TODO: Get Locale
      await restApi.signup(email, password, "en");
      history.push("/verify");
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
    <Container component="main" maxWidth="xs" >
      <div className={classes.paper}>
        <img src="https://static-2-badanamu.akamaized.net/wp-content/uploads/2017/04/cropped-Badanamu-PNG-2.png" style={{ marginBottom: 12 }} />
        <Typography component="h1" variant="h5">
          <FormattedMessage
            id="create_account"
            values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }}
          />
        </Typography>
        <FormControl className={classes.form}>
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
          <BadanamuButton
            fullWidth
            size="large"
            disabled={inFlight}
            onClick={() => signupClick()}
          >
            {
              inFlight ?
                <CircularProgress size={25} /> :
                <FormattedMessage id="sign_up_button" />
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
                onClick={(e: React.MouseEvent) => { history.push("/login"); e.preventDefault(); }}
              >
                <FormattedMessage id="sign_up_already" />
              </Link>
            </Grid>
          </Grid>
        </FormControl>
      </div>
    </Container>
  );
}
