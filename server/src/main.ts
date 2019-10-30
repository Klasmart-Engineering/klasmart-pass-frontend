// tslint:disable:no-console
import { BraintreeGateway, Environment } from "braintree";
import { Request, Response } from "express";
import * as express from "express";

function main() {
    if (!process.env.BT_MERCHANT_ID) {
        console.error("braintree enviroment variable 'BT_MERCHANT_ID' not set");
    }
    if (!process.env.BT_PUBLIC_KEY) {
        console.error("braintree enviroment variable 'BT_PUBLIC_KEY' not set");
    }
    if (!process.env.BT_PRIVATE_KEY) {
        console.error("braintree enviroment variable 'BT_PRIVATE_KEY' not set");
    }
    if (!process.env.BT_MERCHANT_ID ||
        !process.env.BT_PUBLIC_KEY ||
        !process.env.BT_PRIVATE_KEY) {
        return;
    }

    const gateway = new BraintreeGateway({
        environment: Environment.Sandbox,
        merchantId: process.env.BT_MERCHANT_ID,
        privateKey: process.env.BT_PRIVATE_KEY,
        publicKey: process.env.BT_PUBLIC_KEY,
    });

    const app = express();
    app.on("error", (e) => console.error(e));
    app.get("/", (req: Request, res: Response) => {
        res.send(`Hello, ${req.ip}!`);
    });

    app.get("/token", async (req: Request, res: Response) => {
        try {
            const token = await gateway.clientToken.generate({});
            res.json({token});
        } catch (e) {
            console.error(e);
            res.send({error: true});
        }
    });

    app.get("/payment/:id", async (req: Request, res: Response) => {
        try {
            const transactionId = req.params.id;
            const transaction = await gateway.transaction.find(transactionId);
            res.json({transaction});
        } catch (e) {
            console.error(e);
            res.send({error: true});
        }
    });

    app.post("/payment", async (req: Request, res: Response) => {
        try {
            const paymentMethodNonce = req.body.payment_method_nonce;
            const {clientToken, transaction} = await gateway.transaction.sale({
                amount: "1337",
                options: {

                    storeInVaultOnSuccess: true,
                    submitForSettlement: true,
                },
                paymentMethodNonce,
            });
            res.json({clientToken, transaction});
        } catch (e) {
            console.error(e);
            res.send({error: true});
        }
    });

    const port = process.env.PORT || 8000;
    app.listen(port, () => console.log(`Listening on port ${port}`));
}
