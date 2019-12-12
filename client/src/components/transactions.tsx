import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import Typography from "@material-ui/core/Typography";
import { mergeClasses } from "@material-ui/styles";
import React from "react";
import { FormattedDate, FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { State } from "../store/store";

// TODO: Get pass information from DB later
function PassIDName(id: string) {
    switch (id) {
        case "com.calmid.learnandplay.blap.standard":
        case "com.calmid.learnandplay.blp.standard":
            return <FormattedMessage id="pass_name_standard" values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }} />;
        case "com.calmid.learnandplay.blap.premium":
        case "com.calmid.learnandplay.blp.premium":
            return <FormattedMessage id="pass_name_premium" values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }} />;
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
    const passes = (props.transaction.PassList as any[]).map((pass: any) => {
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
            {
                passes.map((pass) => (!pass ? null :
                    <TableRow key={`${pass.start}-${pass.passId}`}>
                        <TableCell>{date}</TableCell>
                        <TableCell>{pass.passName}</TableCell>
                        <TableCell style={{ textTransform: "capitalize" }}>{store}</TableCell>
                        <TableCell align="right">{pass.passId === "com.calmid.learnandplay.blp.standard" ? "US$20" : "US$50"}</TableCell>
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
