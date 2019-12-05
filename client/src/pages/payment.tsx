import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Fade from "@material-ui/core/Fade";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as Braintree from "braintree-web-drop-in";
import clsx from "clsx";
import * as React from "react";
import { useEffect, useState } from "react";
import { FormattedDate, FormattedMessage } from "react-intl";
import { useSelector, useStore } from "react-redux";
import { useHistory } from "react-router";
import { redirectIfUnauthorized } from "../components/authorized";
import DropIn from "../components/braintree-web-drop-in-react";
import BadanamuButton from "../components/button";
import { PayPalButton } from "../components/paypal";
import BLP from "../img/logo_learning_pass.png";
import BLPPremium from "../img/logo_learning_pass_premium.png";
import { State } from "../store/store";
import { ActionTypes } from "../store/actions";

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
            },
        },
        columnSeparatorRight: {
            minHeight: 350,
            borderRight: "1px solid #aaa",
            [theme.breakpoints.down("xs")]: {
                borderRight: "0px",
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
    }),
);
// tslint:enable:object-literal-sort-keys

export function Payment() {
    const store = useStore();
    const history = useHistory();
    const classes = useStyles();
    const [acceptPolicy, setAcceptPolicy] = useState(false);
    const [paymentReady, setPaymentReady] = useState(false);
    const [acceptUpgrade, setUpgrade] = useState(false);

    const selectedProduct = useSelector((state: State) => state.account.productId);
    const passes = useSelector((state: State) => state.account.passes || []);

    const standardPass = passes.find((element) => element.passId === "com.calmid.learnandplay.blp.standard");
    const premiumPass = passes.find((element) => element.passId === "com.calmid.learnandplay.blp.premium");

    const validStandardPass = standardPass !== undefined ? standardPass.expirationDate > Date.now() : false;
    const validPremiumPass = premiumPass !== undefined ? premiumPass.expirationDate > Date.now() : false;

    redirectIfUnauthorized("/payment");

    return (
        <Container maxWidth="lg" style={{ margin: "auto 0" }}>
            <Card>
                <CardContent className={classes.card}>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        spacing={8}
                    >
                        {(!validStandardPass || acceptUpgrade) && !validPremiumPass ?
                            <React.Fragment>
                                <Grid container item justify="space-between" xs={12} sm={6}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography variant="h3"><FormattedMessage id="payment_delivery_header" /></Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body1">
                                                <FormattedMessage id="landing_select_subheader" />
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container item xs={12} spacing={2} justify="space-between" alignItems="center" className={classes.productImgContainer}>
                                        <img src={selectedProduct === "BLP" ? BLP : BLPPremium} className={classes.productImg} />
                                        <Typography variant="h5">
                                            {selectedProduct === "BLP" ? "US$20" : "US$50"}
                                        </Typography>
                                    </Grid>
                                    <Grid container item xs={12} spacing={2} direction="column" justify="space-between" alignItems="flex-start">
                                        <Grid item>
                                            <Grid item xs={12}>
                                                <Link target="_blank" href="https://kidsloop.net/en/policies/terms" variant="subtitle2">
                                                    <FormattedMessage id="payment_view_terms" /> >
                                                </Link>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Link target="_blank" href="https://kidsloop.net/en/policies/return-policy" variant="subtitle2">
                                                    <FormattedMessage id="payment_view_returns" /> >
                                                </Link>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6} className={classes.columnSeparatorLeft}>
                                    <Typography variant="h3"><FormattedMessage id="payment_pay_option_header" /></Typography>
                                    <div style={{ padding: 32 }} />
                                    <Collapse in={!acceptPolicy}>
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
                                                            style={{ color: (paymentReady && !acceptPolicy) ? "red" : "black" }}
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
                                            <PayPalButton />
                                        </Grid>
                                    </Collapse>
                                </Grid>
                            </React.Fragment>
                            :
                            <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
                                {validPremiumPass ? null :
                                    <Grid item xs={12}>
                                        <Typography variant="body2" align="center">
                                            <FormattedMessage
                                                id="payment_prompt_have_standard_pass"
                                                values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }} />!
                                        </Typography>
                                    </Grid>
                                }
                                <Grid item xs={12}>
                                    {validPremiumPass ?
                                        <React.Fragment>
                                            <Typography variant="body1" align="center"><FormattedMessage id="thank_you_heading"
                                                values={{
                                                    br: <br />,
                                                    pass: <FormattedMessage
                                                        id={validPremiumPass ? "pass_name_premium" : "pass_name_standard"}
                                                        values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }}
                                                    />,
                                                }} />.</Typography>
                                            <Typography variant="h5" align="center"><FormattedMessage id="payment_thankyou_heading" /></Typography>
                                        </React.Fragment> :
                                        <Typography variant="h5" align="center">
                                            <FormattedMessage
                                                id="payment_prompt_upgrade"
                                                values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }} />?
                                        </Typography>
                                    }
                                </Grid>
                                <Grid container style={{ paddingBottom: 32 }}>
                                    <Grid item xs={12} style={{ textAlign: "center" }}>
                                        {validPremiumPass ?
                                            <BadanamuButton
                                                size="large"
                                                onClick={(e) => {
                                                    history.push("/my-account"); e.preventDefault();
                                                }}
                                            >
                                                <FormattedMessage id="thank_you_go_to_dashboard" />
                                            </BadanamuButton> :
                                            <BadanamuButton
                                                size="large"
                                                onClick={(e) => {
                                                    store.dispatch({ type: ActionTypes.PRODUCT_ID, payload: "BLPPremium" });
                                                    setUpgrade(true);
                                                }}
                                            >
                                                <FormattedMessage id="payment_yes_upgrade_btn" />
                                            </BadanamuButton>
                                        }
                                    </Grid>
                                    {validPremiumPass ? null :
                                        <Grid item xs={12} style={{ textAlign: "center" }}>
                                            <Link
                                                href="#"
                                                variant="caption"
                                                onClick={(e: React.MouseEvent) => { history.push("/my-account"); e.preventDefault(); }}
                                            >
                                                <FormattedMessage id="payment_no_upgrade_btn" />
                                            </Link>
                                        </Grid>
                                    }
                                </Grid>
                            </Grid>
                        }
                    </Grid>
                </CardContent>
            </Card>
        </Container >

    );
}
