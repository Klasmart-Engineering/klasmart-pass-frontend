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
import { RouteComponentProps, useHistory } from "react-router-dom";

import BadanamuTextField from "../../components/textfield";
import BadanamuLogo from "../../img/badanamu_logo.png";
import { useRestAPI } from "../../restapi";
import { IdentityType } from "../../utils/accountType";

const useStyles = makeStyles((theme) =>
  createStyles({
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

const initialState = {
  verificationToken: "",
  verificationCode: "",
};

export function Verify(props: Props & RouteComponentProps) {
  const classes = useStyles();
  const [state, setState] = useState(initialState);
  const [error, setError] = useState<JSX.Element | null>(null);
  const [verifyInFlight, setVerifyInFlight] = useState(false);
  const restApi = useRestAPI();
  const history = useHistory();

  async function verify() {
    if (state.verificationCode.length === 0) {
      return;
    }
    if (verifyInFlight) {
      return;
    }
    try {
      console.log(state.verificationCode, verifyInFlight);

      setVerifyInFlight(true);

      await restApi.verifyWithToken(
        state.verificationToken,
        state.verificationCode
      );
      history.replace("/login");
    } catch (e) {
      const errName: string = `ERROR_${e.body.errName}`;
      console.log({ errName });
      setError(<FormattedMessage id={errName} />);
    } finally {
      setVerifyInFlight(false);
    }
  }

  useEffect(() => {
    const params = QueryString.parse(props.location.search);
    const verificationToken = params.verificationToken as string;
    setState((state) => ({ ...state, verificationToken }));
  }, []);

  const type = "email";

  return (
    <Container maxWidth="sm" style={{ margin: "auto 0" }}>
      <Card>
        <CardContent className={classes.card}>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={4}
          >
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <img src={BadanamuLogo} style={{ marginBottom: 12 }} />
            </Grid>
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
                  value={state.verificationCode}
                  onChange={(e) => {
                    const verificationCode = e.target.value;
                    // console.log({ verificationCode });
                    setState((state) => ({
                      ...state,
                      verificationCode,
                    }));
                  }}
                  inputProps={{
                    style: { verticalAlign: "center", fontFamily: "monospace" },
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        className={classes.iconButton}
                        disabled={verifyInFlight}
                        onClick={() => verify()}
                        aria-label="submit"
                      >
                        {verifyInFlight ? (
                          <CircularProgress size={25} />
                        ) : (
                          <ExitToAppRoundedIcon />
                        )}
                      </IconButton>
                    ),
                  }}
                />
                {error === null ? null : (
                  <Typography color="error">{error}</Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
