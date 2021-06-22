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
import PolicyLink from "../components/policyLinks";
import BadanamuTextField from "../components/textfield";
import { useRestAPI } from "../restapi";
import { RestAPIError, RestAPIErrorType } from "../restapi_errors";
import { getIdentityType, IdentityType } from "../utils/accountType";
import { brandingConfig, getAuthLink } from "../config";

import LogoBanner from "../components/LogoBanner"
import { useCookies } from "react-cookie";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      display: "flex",
      alignItems: "center",
      padding: "48px 40px !important",
    },
    link: {
      textAlign: "right",
      justifyContent: "flex-end",
      [theme.breakpoints.down("sm")]: {
        justifyContent: "flex-start",
        paddingTop: theme.spacing(2),
        textAlign: "left",
      },
    },
    formContainer: {
      width: "100%",
    },
  })
);
// tslint:enable:object-literal-sort-keys

// TODO: Lookup standard
const phoneRegex = /^(\+[1-9][0-9]*)?[0-9\- ]*$/;
export function Signup() {
  const [inFlight, setInFlight] = useState(false);
  const [cookies, setCookie] = useCookies(['verificationToken']);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [passwordError, setPasswordError] = useState<JSX.Element | null>(null);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [emailError, setEmailError] = useState<JSX.Element | null>(null);
  const [generalError, setGeneralError] = useState<JSX.Element | null>(null);

  const classes = useStyles();
  const history = useHistory();
  const restApi = useRestAPI();

    const authLink = getAuthLink();

    redirectIfAuthorized();

  function checkPasswordMatch() {
    if (password === "") {
      return;
    }
    if (passwordConfirmation === "") {
      return;
    }
    setPasswordMatchError(password !== passwordConfirmation);
  }

  async function signup(e: React.FormEvent) {
    e.preventDefault();
    setEmailError(null);
    if (inFlight) {
      return;
    }
    if (email === "") {
      setEmailError(<FormattedMessage id="create_account_empty_email" />);
      return;
    }
    if (email.indexOf("@") === -1 && !phoneRegex.test(email)) {
      setEmailError(<FormattedMessage id="create_account_invalid_email" />);
      return;
    }
    if (password === "") {
      setEmailError(<FormattedMessage id="create_account_empty_pass" />);
      return;
    }
    if (password !== passwordConfirmation) {
      setEmailError(<FormattedMessage id="create_account_pass_not_matched" />);
      return;
    }

    const accountType = getIdentityType(email);
    if (accountType === undefined) {
      return;
    }
    try {
      setInFlight(true);
      // TODO: Get Locale
      const response = await restApi.signup(email, password, "en");
      setCookie('verificationToken', response.verificationToken, { path: `/` });
      switch (accountType) {
        case IdentityType.Email:
          console.log(`email`);
          history.push("/verify-email");
          break;
        case IdentityType.Phone:
          console.log(`phone`);
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
                        <LogoBanner/>
                        <Grid item xs={12}>
                            <Typography variant="h5">
                                <FormattedMessage
                                    id="create_account"
                                    values={{ b: (...chunks: any[]) => <strong>{chunks}</strong>, companyName: brandingConfig.company.name }}
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
                                            error={passwordError !== null || passwordMatchError}
                                            helperText={passwordError}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onBlur={() => checkPasswordMatch()}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <BadanamuTextField
                                            required
                                            fullWidth
                                            value={passwordConfirmation}
                                            label={<FormattedMessage id="password_confirmation" />}
                                            type="password"
                                            error={passwordError !== null || passwordMatchError}
                                            helperText={passwordError}
                                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                                            onBlur={() => checkPasswordMatch()}
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
                            <Grid container item xs={12} className={classes.link}>
                                <Grid item>
                                    <Link
                                        href="#"
                                        variant="subtitle2"
                                        onClick={(e: React.MouseEvent) => {
                                            window.location.href = authLink;
                                            e.preventDefault();
                                        }}
                                    >
                                        <FormattedMessage id="sign_up_already" />
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
