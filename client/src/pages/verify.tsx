import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import * as QueryString from "query-string";
import * as React from "react";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useStore } from "react-redux";
import { RouteComponentProps, useHistory, useLocation } from "react-router-dom";

import { redirectIfUnverifiable } from "../components/authorized";
import BadanamuTextField from "../components/textfield";
import { useRestAPI } from "../restapi";
import { RestAPIError } from "../restapi_errors";
import { ActionTypes } from "../store/actions";
import { IdentityType } from "../utils/accountType";

import LogoBanner from "../components/LogoBanner"
import { useCookies } from "react-cookie";

const useStyles = makeStyles((theme) => createStyles({
    card: {
      display: "flex",
      alignItems: "center",
      padding: "48px 40px !important",
    },
    root: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      borderBottom: "1px solid gray",
      borderRadius: 0,
      width: 200,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  })
);

interface Props {
  type: IdentityType;
}

export function Verify(props: Props) {
  const store = useStore();
  const state = store.getState();
  const classes = useStyles();

  const [cookies] = useCookies(['verificationToken']);

  const [verificationCode, setVerificationCode] = useState("");
  const [verificationToken, setVerificationToken] = useState(state.account.verificationToken);
  const [error, setError] = useState<JSX.Element | null>(null);
  const [verifyInFlight, setVerifyInFlight] = useState(false);
  const restApi = useRestAPI();
  const history = useHistory();
  const location = useLocation();

  const params = QueryString.parse(location.search);
  if (typeof params.accountId === "string") {
    store.dispatch({
      type: ActionTypes.ACCOUNT_ID,
      payload: { accountId: params.accountId },
    });
  }

  console.log(`verify type: `, props.type);
  console.log(`verifyToken: `, verificationToken);

  async function verify() {
    if (verificationCode === "") return;
    if (verifyInFlight) return;
    console.log(cookies.verificationToken);

    try {
      setVerifyInFlight(true);
      await restApi.verifyWithToken(cookies.verificationToken, verificationCode);
      cookies.removeCookie(`verificationToken`);
    } catch (e) {
      if (e instanceof RestAPIError) {
        const id = e.getErrorMessageID();
        setError(<FormattedMessage id={id} />);
      }
    } finally {
      setVerifyInFlight(false);
    }

    window.location.href = window.location.origin;
    // history.replace("/login");
  }

  useEffect(() => {
    if (typeof params.code === "string") {
      setVerificationCode(params.code);
      verify();
    }
  }, []);

  let stopVerifyCheckLoop = false;
  async function verifyCheckLoop() {
    try {
      const verified = await restApi.verifyCheck(props.type);
      if (verified) {
        history.replace("/");
      }
    } catch (e) {
    } finally {
      if (!stopVerifyCheckLoop) {
        setTimeout(() => verifyCheckLoop(), 1000);
      }
    }
  }
  useEffect(() => {
    if (props.type === IdentityType.Email) {
      verifyCheckLoop();
    }
    return () => {
      stopVerifyCheckLoop = true;
    };
  });

  const type = IdentityType[props.type].toLowerCase();

    return (
        <Container maxWidth="sm" style={{ margin: "auto 0" }}>
            <Card>
                <CardContent className={classes.card}>
                    <Grid container justify="center" spacing={4}>
                        <LogoBanner/>
                        <Grid item xs={12}>
                            <Typography variant="h5" align="center">
                                <FormattedMessage id={`verify_${type}`} />
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" align="center">
                                <FormattedMessage id={`verify_${type}_directions`} />
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <FormControl fullWidth>
                                <BadanamuTextField
                                    required
                                    fullWidth
                                    id="verify_code"
                                    label={<FormattedMessage id={`verify_${type}_code`} />}
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    inputProps={{ style: { verticalAlign: "center", fontFamily: "monospace" } }}
                                    InputProps={{
                                        endAdornment:
                                            <IconButton
                                                className={classes.iconButton}
                                                disabled={verifyInFlight}
                                                onClick={() => verify()}
                                                aria-label="submit"
                                            >
                                                {verifyInFlight ? <CircularProgress size={25} /> : <ExitToAppRoundedIcon />}
                                            </IconButton>,
                                    }}
                                />
                                {
                                    error === null ? null :
                                        <Typography color="error">
                                            {error}
                                        </Typography>
                                }
                            </FormControl>
                        </Grid>
                        {props.type === IdentityType.Email ?
                            <React.Fragment>
                                <Grid item xs={12} style={{ textAlign: "center" }}>
                                    <CircularProgress size={25} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1" align="center">
                                        <FormattedMessage id={`verify_${type}_waiting`} />
                                    </Typography>
                                </Grid>
                            </React.Fragment> :
                            null
                        }
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
}
