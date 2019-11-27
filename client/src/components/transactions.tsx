import Typography from "@material-ui/core/Typography";
import React from "react";

// TODO: Get pass information from DB later
function PassIDName(id: string) {
    switch (id) {
        case "com.calmid.learnandplay.blp.standard":
            return "Standard Pass";
        case "com.calmid.learnandplay.blp.premium":
            return "Premium Pass";
        default:
            return id;
    }
}

function Transaction(props: { transaction: any }) {
    // TODO: typechecking
    const transactionId: string = props.transaction.TransactionID;
    const split = transactionId.indexOf("_");
    const store = transactionId.slice(0, split).toLocaleLowerCase();
    const id = transactionId.slice(split + 1).toLocaleLowerCase();
    const createdTimestamp: number = props.transaction.CreatedDate;
    const date = new Date(createdTimestamp).toLocaleString();
    const products = (props.transaction.ProductList as any[]).map((product: any) => JSON.stringify(product));
    const passes = (props.transaction.PassList as any[]).filter((pass) => pass !== null).map((pass: any) => {
        // return JSON.stringify(pass);
        return {
            end: pass.ExpirationDate as number,
            passId: pass.ItemID as string,
            passName: PassIDName(pass.ItemID),
            start: pass.StartDate as number,
        };
    });
    return (
        <React.Fragment>
            <Typography>{`${date} - ${store}`}</Typography>
            {/* <Typography>{store}</Typography> */}
            {/* <Typography>{id}</Typography> */}
            <ul>
                {
                    passes.map((pass) => (!pass ? null :
                        <li key={pass.start}>
                            <Typography>{pass.passName}</Typography>
                        </li>
                    ))
                }
            </ul>
            <ul>
                {
                    products.map((product) => (
                        <li key={product}>
                            <Typography>{product}</Typography>
                        </li>
                    ))
                }
            </ul>
        </React.Fragment>
    );
}

interface Props {
    transactions: any[];
}

export function Transactions(props: Props) {
    return (
        <ul>
            {
                props.transactions.map((transaction, i) => (
                    <li key={i}>
                        <Transaction transaction={transaction} />
                    </li>
                ))
            }
        </ul>
    );
}
