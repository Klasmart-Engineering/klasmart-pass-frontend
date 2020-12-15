import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FormattedMessage } from "react-intl";

import { getPassNamePrice } from "../config";

function Transaction(props: { transaction: any }) {
  // TODO: typechecking
  const transactionId: string = props.transaction.transactionId;
  const split = transactionId.indexOf("_");
  const store = transactionId.slice(0, split).toLocaleLowerCase();
  const id = transactionId.slice(split + 1).toLocaleLowerCase();
  const createdTimestamp: number = props.transaction.createdDate;
  const date = new Date(createdTimestamp).toLocaleString();
  const products = (props.transaction
    .productList as any[]).map((product: any) => JSON.stringify(product));
  const passes = props.transaction.passList as any[];
  return (
    <React.Fragment>
      {passes.map((pass: any) =>
        pass == undefined ? null : (
          <TableRow key={`${pass.start}-${pass.passId}`}>
            <TableCell>{date}</TableCell>
            <TableCell>{getPassNamePrice(pass).name}</TableCell>
            <TableCell style={{ textTransform: "capitalize" }}>
              {store}
            </TableCell>
            <TableCell align="right">{getPassNamePrice(pass).price}</TableCell>
          </TableRow>
        )
      )}
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
            <TableCell>
              <FormattedMessage id="my_account_transaction_date" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="my_account_transaction_description" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="my_account_payment_method" />
            </TableCell>
            <TableCell align="right">
              <FormattedMessage id="my_account_total" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.transactions.map((transaction, i) => (
            <Transaction transaction={transaction} key={i} />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
