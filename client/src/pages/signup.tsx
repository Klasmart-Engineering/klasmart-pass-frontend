import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl/FormControl";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import BadanamuButton from "../components/button";
import BadanamuTextField from "../components/textfield";
import { useRestAPI } from "../restapi";
import { RestAPIError } from "../restapi_errors";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      <FormattedMessage id="copyright" />
      {" © "}
      <Link color="inherit" href="https://badanamu.com/">
        Badanamu.com
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

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

export default function SignUp() {
  const [signupInFlight, setSignupInFlight] = useState(false);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [passwordError, setPasswordError] = useState<JSX.Element | null>(null);
  const [emailError, setEmailError] = useState<JSX.Element | null>(null);
  const [generalError, setGeneralError] = useState<JSX.Element | null>(null);

  const classes = useStyles();
  const history = useHistory();
  const restApi = useRestAPI();

  async function signupClick() {
    if (signupInFlight) { return; }
    if (email === "") { return; }
    if (password === "") { return; }
    try {
      setSignupInFlight(true);
      // TODO: Get Locale
      await restApi.signup(email, password, "en");
    } catch (restAPIError) {
      if (restAPIError instanceof RestAPIError) {
        const id = restAPIError.getErrorMessageID();
        const errorMessage = <FormattedMessage id={id} />;
        if (id.match(/password/i)) { setPasswordError(errorMessage); }
        if (id.match(/email/i)) { setEmailError(errorMessage); }
        if (!(id.match(/password|email/i))) { setGeneralError(errorMessage); }
      }
    } finally {
      setSignupInFlight(false);
    }
  }

  return (
    <Container component="main" maxWidth="xs" >
      <CssBaseline />
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
                id="email"
                label={<FormattedMessage id="email" />}
                error={emailError !== null}
                helperText={emailError}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <BadanamuTextField
                required
                fullWidth
                id="password"
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
            // type="submit"
            fullWidth
            size="large"
            disabled={signupInFlight}
            onClick={() => signupClick()}
          >
            {
              signupInFlight ?
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
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
