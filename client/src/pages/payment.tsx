import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
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
import BLP from "../img/logo_learning_pass.png";
import BLPPremium from "../img/logo_learning_pass_premium.png";
import { useRestAPI } from "../restapi";
import { ActionTypes } from "../store/actions";
import { State } from "../store/store";
import { getExpiration } from "../utils/date";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        columnSeparator: {
            borderLeft: "1px solid #aaa",
            [theme.breakpoints.down("sm")]: {
                borderLeft: "0px",
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
    const classes = useStyles();
    const [clientToken, setClientToken] = useState("");
    const [clientTokenInFlight, setClientTokenInFlight] = useState(false);
    const [paymentInFlight, setPaymentInFlight] = useState(false);
    const [paymentReady, setPaymentReady] = useState(false);
    const [braintree, setBrainTree] = useState<Braintree.Dropin | null>(null);
    const [error, setError] = useState<JSX.Element | null>(null);
    const selectedProduct = useSelector((state: State) => state.account.productId);
    const history = useHistory();
    const restApi = useRestAPI();
    const store = useStore();
    // For Testing payment
    const fakeNonce = useSelector((state: State) => state.fakeNonce);

    useEffect(() => {
        getClientToken();
        return;
    }, []);
    redirectIfUnauthorized("/payment");

    async function getClientToken() {
        if (clientTokenInFlight) { return; }
        try {
            setClientTokenInFlight(true);
            const newClientToken = await restApi.getPaymentToken();
            setClientToken(newClientToken);
        } catch (e) {
            setError(<FormattedMessage id={"ERROR_UNKOWN"} />);
        } finally {
            setClientTokenInFlight(false);
        }
    }

    async function buy() {
        if (error !== null) { return; }
        if (braintree === null) { return; }
        if (paymentInFlight) { return; }
        try {
            setPaymentInFlight(true);
            const { nonce } = fakeNonce ? fakeNonce : await braintree.requestPaymentMethod();
            // TODO: change product selection to use productIDs
            let productId = "";
            switch (selectedProduct) {
                case "BLP":
                    productId = "com.calmid.learnandplay.blap.standard";
                    break;
                case "BLPPremium":
                    productId = "com.calmid.learnandplay.blap.premium";
                    break;
                default:
                    throw new Error("Unknown product");
            }
            await restApi.reportPaymentNonce(productId, nonce);
            history.push("/payment-thankyou");
        } catch (e) {
            history.push("/payment-error");
        } finally {
            setPaymentInFlight(false);
        }
    }

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
                        <Grid container item justify="space-between" xs={12} sm={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h3"><FormattedMessage id="payment_delivery_header" /></Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">
                                        <FormattedMessage id="landing_select_subheader" /><FormattedDate value={getExpiration(1)} />.
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
                                        <Link href="#" variant="subtitle2">
                                            <FormattedMessage id="payment_view_terms" /> >
                                        </Link>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Link href="#" variant="subtitle2">
                                            <FormattedMessage id="payment_view_returns" /> >
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6} className={classes.columnSeparator}>
                            {error === null ? null : <Typography color="error">{error}</Typography>}
                            {braintree !== null ? null : <CircularProgress />}
                            {
                                clientTokenInFlight || clientToken === "" ? null :
                                    <div className={clsx(braintree === null && classes.hide)}>
                                        <Typography variant="h3"><FormattedMessage id="payment_pay_option_header" /></Typography>
                                        <div style={{ padding: 32 }} />
                                        <DropIn
                                            options={{
                                                authorization: clientToken,
                                                paypal: { flow: "vault" },
                                            }}
                                            onInstance={(b) => setBrainTree(b)}
                                            onPaymentMethodRequestable={(p) => setPaymentReady(true)}
                                            onNoPaymentMethodRequestable={() => setPaymentReady(false)}
                                        />
                                    </div>
                            }
                            {
                                paymentReady || fakeNonce ?
                                    <BadanamuButton
                                        color="primary"
                                        fullWidth
                                        onClick={() => {
                                            buy();
                                            store.dispatch({ type: ActionTypes.EXPIRE_DATE, payload: getExpiration(1) });
                                        }}
                                        disabled={paymentInFlight}
                                    >
                                        {
                                            paymentInFlight ?
                                                <CircularProgress size={25} /> :
                                                <React.Fragment>
                                                    <FormattedMessage id={"payment_button"} />
                                                    {selectedProduct === "BLP" ? " (US$20)" : " (US$50)"}
                                                </React.Fragment>
                                        }
                                    </BadanamuButton>
                                    : null
                            }
                        </Grid>
                    </Grid>
                    {/* <div style={{ padding: 10 }}>

                    </div> */}
                </CardContent>
            </Card>
        </Container>

    );
}
