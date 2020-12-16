import { Card, CardContent, CircularProgress, Grid } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as QueryString from "query-string";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { RouteComponentProps, useHistory } from "react-router";

import BadanamuButton from "../components/button";
import BadanamuTextField from "../components/textfield";
import BadanamuLogo from "../img/badanamu_logo.png";
import { useRestAPI } from "../restapi";
import { RestAPIError } from "../restapi_errors";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
);

export function RedeemEventTicket(props: RouteComponentProps) {
  const params = QueryString.parse(props.location.search);
  const [inFlight, setInFlight] = React.useState(false);
  const [generalError, setGeneralError] = useState<JSX.Element | null>(null);
  const [ticketId, setTicketId] = useState(
    typeof params.ticketId === "string" ? params.ticketId : ""
  );

  const history = useHistory();
  const classes = useStyles();
  const restApi = useRestAPI();

  async function redeemEventTicket(e: React.FormEvent) {
    e.preventDefault();
    if (inFlight) {
      return;
    }
    try {
      setInFlight(true);
      const response = await restApi.getEventTicketRegion(ticketId);
      await restApi.redeemEventTicket(ticketId, response.regionId);
      history.push("/payment-thankyou?ticket=1");
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
      default:
        setGeneralError(errorMessage);
        break;
    }
  }

  return (
    <Container maxWidth="sm" style={{ margin: "auto 0" }}>
      <Card>
        <CardContent className={classes.card}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={4}
          >
            <Grid item xs={12}>
              <img src={BadanamuLogo} style={{ marginBottom: 12 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">
                <FormattedMessage
                  id="ticket_redeem_heading"
                  values={{
                    b: (...chunks: any[]) => <strong>{chunks}</strong>,
                  }}
                />
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.formContainer}>
              <form onSubmit={(e) => redeemEventTicket(e)}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <BadanamuTextField
                      required
                      fullWidth
                      label={<FormattedMessage id="ticket" />}
                      value={ticketId}
                      onChange={(e) => setTicketId(e.target.value)}
                    />
                  </Grid>
                </Grid>
                <BadanamuButton
                  type="submit"
                  fullWidth
                  size="large"
                  disabled={inFlight}
                >
                  {inFlight ? (
                    <CircularProgress size={25} />
                  ) : (
                    <FormattedMessage id="ticket_redeem_btn" />
                  )}
                </BadanamuButton>
                {generalError === null ? null : (
                  <Typography color="error">{generalError}</Typography>
                )}
              </form>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
