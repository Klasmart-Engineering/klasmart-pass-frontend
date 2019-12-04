
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useRestAPI } from "../restapi";
import { State } from "../store/store";

export function PayPalButton() {
    const selectedProduct = useSelector((state: State) => state.account.productId);
    const paypal = (window as any).paypal;
    const buttonRef = useRef<HTMLDivElement>(null);

    const history = useHistory();
    const api = useRestAPI();

    function getProductCode() {
        switch (selectedProduct) {
            case "BLP":
                return { productCode: "com.calmid.learnandplay.blap.standard", price: "20.00" };
            case "BLPPremium":
                return { productCode: "com.calmid.learnandplay.blap.premium", price: "50.00" };
            default:
                throw new Error("Unknown product");
        }
    }

    const { productCode, price } = getProductCode();

    useEffect(() => {
        if (!paypal) { return; }
        if (!buttonRef.current) { return; }
        const button = paypal.Buttons({
            createOrder(data: any, actions: any) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                    purchase_units: [{ amount: { value: price } }],
                    shipping_preference: "NO_SHIPPING",
                });
            },
            async onApprove(data: any, actions: any) {
                try {
                    const details = await actions.order.capture();
                    console.log(details);
                    console.log(data);
                    await api.reportPaypalOrder(data.orderID, productCode);
                    history.push("/payment-thankyou");
                } catch (e) {
                    history.push("/payment-error");
                }
            },
        });
        button.render(buttonRef.current);
    }, [paypal]);
    return <div ref={buttonRef}></div>;
}
