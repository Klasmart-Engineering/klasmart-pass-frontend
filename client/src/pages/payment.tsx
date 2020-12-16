import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useStore } from "react-redux";
import { useHistory } from "react-router";

import { redirectIfUnauthorized } from "../components/authorized";
import BadanamuButton from "../components/button";
import { PayPalButtons } from "@paypal/react-paypal-js";

import { useRestAPI } from "../restapi";
import { formatCurrency, getImgByPassId } from "./../config";
import { RootState } from "../redux-toolkit/rootReducer";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    checkbox: {
      paddingBottom: theme.spacing(4),
      [theme.breakpoints.down("xs")]: {
        paddingBottom: theme.spacing(2),
      },
    },
    columnSeparatorLeft: {
      minHeight: 350,
      borderLeft: "1px solid #aaa",
      [theme.breakpoints.down("xs")]: {
        borderLeft: "0px",
        borderBottom: "1px solid #aaa",
      },
    },
    columnSeparatorRight: {
      minHeight: 350,
      borderRight: "1px solid #aaa",
      [theme.breakpoints.down("xs")]: {
        borderRight: "0px",
        borderBottom: "1px solid #aaa",
      },
    },
    hide: {
      display: "none",
    },
    card: {
      display: "flex",
      padding: "48px 32px !important",
    },
    productImgContainer: {
      textAlign: "left",
      minHeight: 96,
      margin: 0,
      padding: theme.spacing(4, 0),
      [theme.breakpoints.down("sm")]: {
        minHeight: 72,
      },
    },
    productImg: {
      maxWidth: 256,
      [theme.breakpoints.down("sm")]: {
        maxWidth: 128,
      },
    },
    emptySpace: {
      height: theme.spacing(8),
      [theme.breakpoints.down("xs")]: {
        height: theme.spacing(4),
      },
    },
  })
);
// tslint:enable:object-literal-sort-keys

export function Payment() {
  const store = useStore();
  const history = useHistory();
  const classes = useStyles();
  const restApi = useRestAPI();
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);

  const [hasPassAccess, setHasPassAccess] = useState(true);
  const [getPassAccessError, setGetPassAccessError] = useState<
    JSX.Element | undefined
  >(undefined);
  const [getPassAccessInFlight, setPassAccessInFlight] = useState(false);

  const selectedPass = useSelector((state: RootState) => state.account.pass);
  const productCode = selectedPass.passId;
  const price: string = selectedPass.price;

  async function getPassAccess() {
    if (getPassAccessInFlight) {
      return;
    }
    try {
      setPassAccessInFlight(true);
      const response = await restApi.getPassAccess(selectedPass.passId);
      setHasPassAccess(response.access);
    } catch (e) {
      // TODO: More specific error message
      setGetPassAccessError(<FormattedMessage id="ERROR_UNKOWN" />);
    } finally {
      setPassAccessInFlight(false);
    }
  }

  redirectIfUnauthorized("/payment");

  const accessToken = useSelector(
    (state: RootState) => state.account.accessToken
  );
  const refreshToken = useSelector(
    (state: RootState) => state.account.refreshToken
  );

  useEffect(() => {
    if (accessToken !== null || refreshToken !== null) {
      getPassAccess();
    }
  }, [accessToken, refreshToken]);

  const api = useRestAPI();

  return (
    <Container maxWidth={"lg"} style={{ margin: "auto 0" }}>
      <Collapse in={!hasPassAccess}>
        <Card>
          <CardContent className={classes.card}>
            <Grid container direction="row" spacing={8}>
              <Grid
                container
                item
                xs={12}
                sm={6}
                spacing={2}
                className={classes.columnSeparatorRight}
              >
                <Grid item xs={12}>
                  <Typography variant="h3">
                    <FormattedMessage id="payment_delivery_header" />
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <FormattedMessage id="landing_select_subheader" />
                  </Typography>
                </Grid>
                <Grid item xs={12} className={classes.emptySpace} />
                <Grid
                  container
                  item
                  justify="space-between"
                  alignItems="center"
                  xs={12}
                  spacing={2}
                >
                  <img
                    src={getImgByPassId(selectedPass.passId)}
                    className={classes.productImg}
                  />
                  <Typography variant="h5">
                    {formatCurrency(selectedPass.currency) + selectedPass.price}
                  </Typography>
                </Grid>
                <Grid item xs={12} className={classes.emptySpace} />
                <Grid item xs={12}>
                  <Link
                    target="_blank"
                    href="https://kidsloop.net/en/policies/terms"
                    variant="subtitle2"
                  >
                    <FormattedMessage id="payment_view_terms" /> &gt;
                  </Link>
                  <br />
                  <Link
                    target="_blank"
                    href="https://kidsloop.net/en/policies/return-policy"
                    variant="subtitle2"
                  >
                    <FormattedMessage id="payment_view_returns" /> &gt;
                  </Link>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h3">
                  <FormattedMessage id="payment_pay_option_header" />
                </Typography>
                <Grid item xs={12} className={classes.emptySpace} />
                <Collapse in={!acceptPolicy}>
                  <Grid item xs={12} className={classes.emptySpace} />
                  <Grid item xs={12}>
                    <FormGroup row className={classes.checkbox}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            required
                            checked={acceptPolicy}
                            onChange={() => setAcceptPolicy(!acceptPolicy)}
                            value="policy-accepted"
                          />
                        }
                        label={
                          <Typography
                            variant="caption"
                            style={{
                              color:
                                paymentReady && !acceptPolicy ? "red" : "black",
                            }}
                          >
                            <FormattedMessage id="payment_accept_terms" />
                          </Typography>
                        }
                      />
                    </FormGroup>
                  </Grid>
                </Collapse>
                <Collapse in={acceptPolicy}>
                  <Grid item>
                    <Grid item xs={12} style={{ height: 48 }} />
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      createOrder={(data, actions) => {
                        // // This function sets up the details of the transaction, including the amount and line item details.
                        // return actions.order.create({
                        //   // application_context: {
                        //   //   shipping_preference: "NO_SHIPPING",
                        //   // },
                        //   purchase_units: [{ amount: { value: price } }],
                        // });
                      }}
                      onApprove={async (data, actions) => {
                        //   try {
                        //     const details = await actions.order(); //.capture();
                        //     console.log(details);
                        //     console.log(data);
                        //     await api.reportPaypalOrder(
                        //       data.orderID,
                        //       productCode
                        //     );
                        //     history.push("/payment-thankyou");
                        //   } catch (e) {
                        //     history.push("/payment-error");
                        //   }
                      }}
                    />
                  </Grid>
                </Collapse>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Collapse>
      <Collapse in={hasPassAccess}>
        <Card>
          <CardContent className={classes.card}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={2}
            >
              <React.Fragment>
                <Grid item xs={12}>
                  <Typography variant="body1" align="center">
                    <FormattedMessage
                      id="thank_you_heading"
                      values={{
                        br: <br />,
                        pass: (
                          <FormattedMessage
                            id={"pass_name"}
                            values={{
                              b: (...chunks: any[]) => (
                                <strong>{chunks}</strong>
                              ),
                            }}
                          />
                        ),
                      }}
                    />
                    .
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" align="center">
                    <FormattedMessage id="payment_thankyou_heading" />
                  </Typography>
                </Grid>
                <Grid item xs={12} style={{ height: 16 }} />
                <BadanamuButton
                  size="large"
                  onClick={(e) => {
                    history.push("/my-account");
                    e.preventDefault();
                  }}
                >
                  <FormattedMessage id="thank_you_go_to_dashboard" />
                </BadanamuButton>
              </React.Fragment>
            </Grid>
          </CardContent>
        </Card>
      </Collapse>
    </Container>
  );
}
