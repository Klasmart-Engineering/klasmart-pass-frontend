import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as QueryString from "query-string";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { RouteComponentProps, useHistory } from "react-router";

import BadanamuButton from "../components/button";
import BadanamuLogo from "../img/badanamu_logo.png";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      display: "flex",
      alignItems: "center",
      padding: "48px 40px !important",
    },
    formContainer: {
      width: "100%",
    },
  })
);
// tslint:enable:object-literal-sort-keys
export function PaymentThankyou(props: RouteComponentProps) {
  const params = QueryString.parse(props.location.search);
  const fromTicket = typeof params.ticket === "string" ? params.ticket : "";

  const classes = useStyles();
  const history = useHistory();

  // const expiration = useSelector((state: State) => state.account.expireDate);
  // const selectedProduct = useSelector((state: State) => state.account.productId);
  // const defaultEmail = useSelector((state: State) => state.account.email || "");

  return (
    <Container maxWidth="sm">
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
              <Typography variant="h4" align="center">
                {fromTicket === "1" ? (
                  <FormattedMessage
                    id="thank_you_ticket_heading"
                    values={{
                      br: <br />,
                      pass: (
                        <FormattedMessage
                          id={"pass_name"}
                          values={{
                            b: (...chunks: any[]) => <strong>{chunks}</strong>,
                          }}
                        />
                      ),
                    }}
                  />
                ) : (
                  <FormattedMessage
                    id="thank_you_heading"
                    values={{
                      br: <br />,
                      pass: (
                        <FormattedMessage
                          id={"pass_name"}
                          values={{
                            b: (...chunks: any[]) => <strong>{chunks}</strong>,
                          }}
                        />
                      ),
                    }}
                  />
                )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" align="center">
                <FormattedMessage
                  id="thank_you_intro1"
                  values={{ br: <br /> }}
                />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" align="center">
                <FormattedMessage id="thank_you_intro2" />
              </Typography>
            </Grid>
            <Grid item xs={12} style={{ width: "100%" }}>
              <Divider orientation="horizontal" variant="fullWidth" />
            </Grid>
            {/* <Grid item xs={6}>
                            <Typography variant="caption">
                                <FormattedMessage id="thank_you_account" />
                                <b>{defaultEmail}</b>
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="caption">
                                <FormattedMessage id="thank_you_expiration" />
                                <b><FormattedDate value={expiration} /></b>
                            </Typography>
                        </Grid> */}
            <Grid item xs={12}>
              <BadanamuButton
                fullWidth
                onClick={(e) => {
                  history.push("/my-account");
                }}
              >
                <FormattedMessage id="thank_you_go_to_dashboard" />
              </BadanamuButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
