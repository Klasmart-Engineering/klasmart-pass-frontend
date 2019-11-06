import CircularProgress from "@material-ui/core/CircularProgress";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as Braintree from "braintree-web-drop-in";
import clsx from "clsx";
import * as React from "react";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import DropIn from "../components/braintree-web-drop-in-react";
import BadanamuButton from "../components/button";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        hide: {
            display: "none",
        },
    }),
);
// tslint:enable:object-literal-sort-keys

export default function Payment() {
    const classes = useStyles();
    const [clientToken, setClientToken] = useState("");
    const [clientTokenInFlight, setClientTokenInFlight] = useState(false);
    const [paymentReady, setPaymentReady] = useState(false);
    const [braintree, setBrainTree] = useState<Braintree.Dropin | null>(null);
    const [error, setError] = useState<JSX.Element | null>(null);
    useEffect(() => {
        getClientToken();
        return;
    }, []);

    async function getClientToken() {
        if (clientTokenInFlight) { return; }
        try {
            setClientTokenInFlight(true);
            const response = await fetch("./token");
            const body = await response.json(); // If returned as JSON string
            setClientToken(body.clientToken);
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
        const request = {
            body: JSON.stringify({ nonce }),
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            method: "POST",
        };
        console.log(request);
        await fetch(`./payment`, request);
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
