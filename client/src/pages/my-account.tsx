import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { FormattedDate, FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { redirectIfUnauthorized } from "../components/authorized";
import { Transactions } from "../components/transactions";
import BLP from "../img/learning_pass_color_b.01.png";
import BLPPremium from "../img/learning_pass_premium_color_b.01.png";
import { useRestAPI } from "../restapi";
import { State } from "../store/store";
import { getExpiration } from "../utils/date";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) => createStyles({
    card: {
        alignItems: "center",
        display: "flex",
        padding: "48px 40px !important",
    },
    row: {
        textAlign: "left",
    },
    emptySpace: {
        padding: theme.spacing(4),
    },
    bigAvatar: {
        width: 96,
        height: 96,
    },
    sectionDivider: {
        margin: theme.spacing(2, 0),
    },
    productImgContainer: {
        textAlign: "right",
        minHeight: 96,
        margin: 0,
        padding: theme.spacing(4, 0),
        [theme.breakpoints.down("sm")]: {
            minHeight: 72,
        },
    },
    productImg: {
        maxWidth: 192,
        [theme.breakpoints.down("sm")]: {
            maxWidth: 128,
        },
    },
}),
);

export function MyAccount() {
    const [transactions, setTransactions] = useState<any[] | undefined>(undefined);
    const [transactionsError, setTransactionsError] = useState<JSX.Element | undefined>(undefined);
    const [transactionsInFlight, setTransactionsInFlight] = useState(false);

    const classes = useStyles();
    const history = useHistory();
    const restApi = useRestAPI();

    const expiration = useSelector((state: State) => state.account.expireDate);
    const selectedProduct = useSelector((state: State) => state.account.productId);
    const defaultEmail = useSelector((state: State) => state.account.email || "");

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
        <Container maxWidth="lg" >
            <div className={classes.emptySpace} />
            <Grid container direction="column" spacing={4} >
                <Grid container item direction="row" alignItems="center" spacing={4} xs={12}>
                    <Grid item>
                        <Avatar alt={defaultEmail} src="" className={classes.bigAvatar} />
                    </Grid>
                    <Grid item>
                        <Typography variant="h4">{defaultEmail}</Typography>
                        <Typography variant="body1"><b>{selectedProduct === "BLP" ? "Badanamu Learning Pass" : "Badanamu Learning Pass Premium"},</b> expires <b><FormattedDate value={expiration} /></b>.</Typography>
                    </Grid>
                </Grid>
                <div className={classes.emptySpace} />
                <Grid item xs={12}>
                    <Typography variant="h2">
                        <FormattedMessage id="my_account_header" />
                    </Typography>
                    <Divider light className={classes.sectionDivider} />
                    <Grid container item direction="row" spacing={4} xs={12}>
                        <Grid item xs={4}>
                            <Typography variant="h6" style={{ color: "#aaa" }}>PROFILE</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="h6" align="right">{defaultEmail}</Typography>
                            <Typography variant="h6" align="right">
                                <Link
                                    href="#"
                                    variant="subtitle2"
                                    onClick={(e: React.MouseEvent) => { history.push("/password-change"); e.preventDefault(); }}
                                >
                                    <FormattedMessage id="password_change" />
                                </Link>
                            </Typography>
                        </Grid>
                    </Grid>
                    <div className={classes.emptySpace} />
                    <Grid container item direction="row" spacing={4} xs={12}>
                        <Grid item xs={4}>
                            <Typography variant="h6" style={{ color: "#aaa" }}>PLAN DETAILS</Typography>
                        </Grid>
                        <Grid item xs={8} className={classes.productImgContainer}>
                            <img src={selectedProduct === "BLP" ? BLP : BLPPremium} className={classes.productImg} />
                        </Grid>
                    </Grid>
                    <div className={classes.emptySpace} />
                    <Grid container item direction="row" spacing={4} xs={12}>
                        <Grid item xs={12}>
                            <Typography variant="h6" style={{ textTransform: "uppercase", color: "#aaa" }}><FormattedMessage id="transaction_history" /></Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.productImgContainer}>
                            {
                                transactionsInFlight ?
                                    <CircularProgress /> :
                                    transactions !== undefined ?
                                        <Transactions transactions={transactions} /> :
                                        <Typography>{transactionsError}</Typography>
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container >
    );
}
