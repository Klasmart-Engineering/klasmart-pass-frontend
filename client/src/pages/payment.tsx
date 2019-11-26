import CircularProgress from "@material-ui/core/CircularProgress";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as Braintree from "braintree-web-drop-in";
import clsx from "clsx";
import * as React from "react";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { redirectIfUnauthorized } from "../components/authorized";
import DropIn from "../components/braintree-web-drop-in-react";
import BadanamuButton from "../components/button";
import { useRestAPI } from "../restapi";
import { State } from "../store/store";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        hide: {
            display: "none",
        },
    }),
);
// tslint:enable:object-literal-sort-keys

export function Payment() {
    const classes = useStyles();
    const [clientToken, setClientToken] = useState("");
    const [clientTokenInFlight, setClientTokenInFlight] = useState(false);
    const [paymentReady, setPaymentReady] = useState(false);
    const [braintree, setBrainTree] = useState<Braintree.Dropin | null>(null);
    const [error, setError] = useState<JSX.Element | null>(null);
    const selectedProduct = useSelector((state: State) => state.account.productId);

    const restApi = useRestAPI();

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
        // Send the nonce to your server
        const { nonce } = await braintree.requestPaymentMethod();
        // TODO: change product selection to use productIDs
        let productId = "";
        switch (selectedProduct) {
            case "BLP":
                productId = "com.calmid.learnandplay.blp.standard";
                break;
            case "BLPPremium":
                productId = "com.calmid.learnandplay.blp.premium";
                break;
            default:
                console.error(`unknown product '${productId}'`);
                setError(<FormattedMessage id={"ERROR_UNKOWN"} />);
                return;
        }
        await restApi.reportPaymentNonce(productId, nonce);
    }

    return (
        <div style={{ padding: 10 }}>
            {error === null ? null : <Typography color="error">{error}</Typography>}
            {braintree !== null ? null : <CircularProgress />}
            {
                clientTokenInFlight || clientToken === "" ? null :
                    <div className={clsx(braintree === null && classes.hide)}>
                        <DropIn
                            options={{
                                authorization: clientToken,
                                paypal: { flow: "checkout" },
                            }}
                            onInstance={(b) => setBrainTree(b)}
                            onPaymentMethodRequestable={(p) => setPaymentReady(true)}
                            onNoPaymentMethodRequestable={() => setPaymentReady(false)}
                        />
                    </div>
            }
            {
                paymentReady ?
                    <BadanamuButton color="primary" onClick={() => buy()}>
                        <FormattedMessage id={"payment_button"} />
                    </BadanamuButton>
                    : null
            }
        </div>
    );
}
