import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useRestAPI } from "../restapi";
import { State } from "../store/store";

export function PayPalButton() {
    const [inFlight, setInFlight] = useState(false);
    const selectedProduct = useSelector((state: State) => state.account.productId);
    const paypal = (window as any).paypal;
    const buttonRef = useRef<HTMLDivElement>(null);

    const history = useHistory();
    const api = useRestAPI();

    function getProductCode() {
        switch (selectedProduct) {
            case "BLP":
                return { productCode: "com.calmid.learnandplay.blp.standard", price: "20.00" };
            case "BLPPremium":
                return { productCode: "com.calmid.learnandplay.blp.premium", price: "50.00" };
            default:
                throw new Error("Unknown product");
        }
    }

    const { productCode, price } = getProductCode();

    useEffect(() => {
        if (!paypal) { return; }
        if (!buttonRef.current) { return; }
        for (const child of buttonRef.current.childNodes) {
            child.remove();
        }
        const button = paypal.Buttons({
            createOrder(data: any, actions: any) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                    application_context: {
                        shipping_preference: "NO_SHIPPING",
                    },
                    purchase_units: [{ amount: { value: price } }],
                });
            },
            async onApprove(data: any, actions: any) {
                try {
                    setInFlight(true);
                    const details = await actions.order.capture();
                    // console.log(details);
                    // console.log(data);
                    await api.reportPaypalOrder(data.orderID, productCode);
                    history.push("/payment-thankyou");
                } catch (e) {
                    history.push("/payment-error");
                }
            },
        });
        button.render(buttonRef.current);
    }, [paypal, selectedProduct]);
    return < >
        <div ref={buttonRef} style={{ visibility: inFlight ? "hidden" : "visible" }} />
        {inFlight ?
            <Grid container direction="column" justify="flex-start" alignItems="center"><CircularProgress /></Grid> : null}
    </ >;
}
