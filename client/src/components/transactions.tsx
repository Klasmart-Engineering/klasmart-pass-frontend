import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { mergeClasses } from "@material-ui/styles";
import React from "react";
import { FormattedDate } from "react-intl";
import { useSelector } from "react-redux";
import { State } from "../store/store";
import Paper from "@material-ui/core/Paper";

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
    const expiration = useSelector((state: State) => state.account.expireDate);
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
            {
                passes.map((pass) => (!pass ? null :
                    <React.Fragment>
                        <TableCell>{date}</TableCell>
                        <TableCell>{pass.passName === "Standard Pass" ? "Learning Pass" : "Learning Pass Premium"}</TableCell>
                        <TableCell>{date.split(",")[0]} - <FormattedDate value={expiration} /></TableCell>
                        <TableCell style={{ textTransform: "capitalize" }}>{store}</TableCell>
                        <TableCell align="right">{pass.passName === "Standard Pass" ? "US$20" : "US$50"}</TableCell>
                    </React.Fragment>
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
            <Table style={{ minWidth: 400 }} aria-label="transaction-history">
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Service Period</TableCell>
                        <TableCell>Payment Method</TableCell>
                        <TableCell align="right">Total</TableCell>
                    </TableRow>
                </TableHead>
                {
                    props.transactions.map((transaction, i) => (
                        <TableRow key={i}>
                            <Transaction transaction={transaction} />
                        </TableRow>
                    ))
                }
            </Table>
        </Paper>
    );
}
