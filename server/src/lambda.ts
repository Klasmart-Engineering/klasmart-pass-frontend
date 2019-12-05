import { Context } from "aws-lambda";
import { BraintreeGateway, Environment } from "braintree";

exports.handler = async (event: any, context: Context) => {
    const merchantId = process.env.BT_MERCHANT_ID;
    const privateKey = process.env.BT_PRIVATE_KEY;
    const publicKey = process.env.BT_PUBLIC_KEY;
    if (!merchantId) {
        console.error("braintree enviroment variable 'BT_MERCHANT_ID' not set");
    }
    if (!privateKey) {
        console.error("braintree enviroment variable 'BT_PRIVATE_KEY' not set");
    }
    if (!publicKey) {
        console.error("braintree enviroment variable 'BT_PUBLIC_KEY' not set");
    }
    if (!merchantId ||
        !publicKey ||
        !privateKey) {
        throw new Error("Missing Braintree Enviroment variable");
    }
    if (typeof event !== "object" ||
        typeof event.type !== "string") {
        throw new Error("Invalid parameters");
    }

    const gateway = new BraintreeGateway({
        environment: Environment.Sandbox,
        merchantId,
        privateKey,
        publicKey,
    });
    switch (event.type) {
        case "token":
            return token(gateway);
        case "payment":
            return payment(gateway, event);
        default:
            throw new Error(`Unknown event type '${event.type}'`);
    }

};

async function token(gateway: BraintreeGateway) {
    const { clientToken } = await gateway.clientToken.generate({});
    return { clientToken };
}

async function payment(gateway: BraintreeGateway, event: any) {
    if (typeof event.nonce !== "string") { throw new Error("Invalid nonce"); }
    if (typeof event.amount !== "string") { throw new Error("Invalid amount"); }

    const { nonce, amount } = event;

    const result = await gateway.transaction.sale({
        amount,
        options: {
            storeInVaultOnSuccess: true,
            submitForSettlement: true,
        },
        paymentMethodNonce: nonce,
    });
    console.log(result);

    if (result.transaction) {
        return { success: true, transactionId: result.transaction.id };
    } else {
        return { success: false, errors: result.errors };
    }
}
