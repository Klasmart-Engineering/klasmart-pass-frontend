import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FormattedDate, FormattedMessage } from "react-intl";

// TODO: Get pass information from DB later
function PassIDName(id: string) {
    switch (id) {
        case "com.calmid.learnandplay.blp.standard":
            return { name: <FormattedMessage id="pass_name_standard" values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }} />, price: "US$20" };
        case "com.calmid.learnandplay.blp.premium":
            return { name: <FormattedMessage id="pass_name_premium" values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }} />, price: "US$50" };
        case "com.calmid.badanamu.esl.premium":
            return { name: <FormattedMessage id="pass_name_premium" values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }} />, price: "US$40" };
        default:
            return { name: id, price: "N/A" };
    }
}

function GetPurchasePrice(passId: string, store: string) {
    var passInfo = PassIDName(passId)
    switch (store.toLocaleLowerCase()) {
        case "ticket":
            passInfo.price = "US$0"
            break
    }
    return passInfo
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
    const passes = (props.transaction.PassList as any[]).map((pass: any) => {
        return {
            end: pass.ExpirationDate as number,
            passId: pass.PassID as string,
            passName: GetPurchasePrice(pass.PassID, store).name,
            start: pass.StartDate as number,
        };
    });
    return (
        <React.Fragment>
            {
                passes.map((pass) => (!pass ? null :
                    <TableRow key={`${pass.start}-${pass.passId}`}>
                        <TableCell>{date}</TableCell>
                        <TableCell>{pass.passName}</TableCell>
                        <TableCell style={{ textTransform: "capitalize" }}>{store}</TableCell>
                        <TableCell align="right">{GetPurchasePrice(pass.passId, store).price}</TableCell>
                    </TableRow>
                ))
            }
        </React.Fragment>
    );
}

interface Props {
    transactions: any[];
}

export function Transactions(props: Props) {
    return (
        <Paper style={{ width: "100%", overflowX: "auto" }}>
            <Table style={{ minWidth: 320 }} aria-label="transaction-history">
                <TableHead>
                    <TableRow>
                        <TableCell><FormattedMessage id="my_account_transaction_date" /></TableCell>
                        <TableCell><FormattedMessage id="my_account_transaction_description" /></TableCell>
                        <TableCell><FormattedMessage id="my_account_payment_method" /></TableCell>
                        <TableCell align="right"><FormattedMessage id="my_account_total" /></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.transactions.map((transaction, i) => (
                            <Transaction transaction={transaction} key={i} />
                        ))
                    }
                </TableBody>
            </Table>
        </Paper>
    );
}
