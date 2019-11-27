import { CircularProgress, Link } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import { redirectIfUnauthorized } from "../components/authorized";
import { Transactions } from "../components/transactions";
import { useRestAPI } from "../restapi";

export function MyAccount() {
    const [transactions, setTransactions] = useState<any[] | undefined>(undefined);
    const [transactionsError, setTransactionsError] = useState<JSX.Element | undefined>(undefined);
    const [transactionsInFlight, setTransactionsInFlight] = useState(false);

    const history = useHistory();
    const restApi = useRestAPI();

    redirectIfUnauthorized("/my-account");

    async function getTransactionHistory() {
        if (transactionsInFlight) { return; }
        try {
            setTransactionsInFlight(true);
            const newTransactions = await restApi.getTransactionHistory();
            setTransactions(newTransactions);
        } catch (e) {
            // TODO: More specific error message
            setTransactionsError(<FormattedMessage id="ERROR_UNKOWN" />);
        } finally {
            setTransactionsInFlight(false);
        }
    }
    useEffect(() => { getTransactionHistory(); }, []);
    return (
        <Container maxWidth="xs" >
            <Typography component="h1" variant="h5">
                <FormattedMessage id="my_account_header" />
            </Typography>
            <Link
                href="#"
                variant="subtitle2"
                onClick={(e: React.MouseEvent) => { history.push("/password-change"); e.preventDefault(); }}
            >
                <FormattedMessage id="password_change" />
            </Link>
            <br />
            <br />
            <Typography component="h1" variant="h5">
                <FormattedMessage id="transaction_history" />
            </Typography>
            {
                transactionsInFlight ?
                    <CircularProgress /> :
                    transactions !== undefined ?
                        <Transactions transactions={transactions} /> :
                        <Typography>{transactionsError}</Typography>
            }
        </Container>
    );
}
