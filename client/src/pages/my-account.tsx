import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { redirectIfUnauthorized } from "../components/authorized";
import { Passes } from "../components/passes";
import { Products } from "../components/products";
import { Transactions } from "../components/transactions";
import { RootState } from "../store/rootReducer";
import { useRestAPI } from "../restapi";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(2),
      },
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
    sectionTypography: {
      textAlign: "right",
      [theme.breakpoints.down("xs")]: {
        textAlign: "left",
      },
    },
  })
);

export function MyAccount() {
  const [transactions, setTransactions] = useState<any[] | undefined>(
    undefined
  );
  const [transactionsError, setTransactionsError] = useState<
    JSX.Element | undefined
  >(undefined);
  const [transactionsInFlight, setTransactionsInFlight] = useState(false);

  const [products, setProducts] = useState<any[] | undefined>(undefined);
  const [productsError, setProductsError] = useState<JSX.Element | undefined>(
    undefined
  );
  const [productsInFlight, setProductsInFlight] = useState(false);

  const classes = useStyles();
  const history = useHistory();
  const restApi = useRestAPI();

  // const selectedProduct = useSelector((state: State) => state.account.productId);
  const defaultEmail = useSelector(
    (state: RootState) => state.account.email || ""
  );

  redirectIfUnauthorized("/my-account");

  async function getProductAccesses() {
    if (productsInFlight) {
      return;
    }
    try {
      setProductsInFlight(true);
      const response = await restApi.getProductAccesses();
      var products = response.products;
      const productIds = response.products.map((product: any) => {
        return product.productId;
      });
      const productInfoResponse = await restApi.getProductInfoByIds(productIds);
      const productInfoList = productInfoResponse.products;
      for (var i = 0; i < productInfoList.length; ++i) {
        for (var j = 0; j < products.length; ++j) {
          if (products[j].productId === productInfoList[i].prodId) {
            products[j].title = productInfoList[i].title;
          }
        }
      }
      setProducts(products);
    } catch (e) {
      // TODO: More specific error message
      setProductsError(<FormattedMessage id="ERROR_UNKOWN" />);
    } finally {
      setProductsInFlight(false);
    }
  }

  async function getTransactionHistory() {
    if (transactionsInFlight) {
      return;
    }
    try {
      setTransactionsInFlight(true);
      const newTransactions = await restApi.getTransactionHistory();
      newTransactions.sort((txA, txB) => txB.CreatedDate - txA.CreatedDate);
      setTransactions(newTransactions);
    } catch (e) {
      // TODO: More specific error message
      setTransactionsError(<FormattedMessage id="ERROR_UNKOWN" />);
    } finally {
      setTransactionsInFlight(false);
    }
  }
  useEffect(() => {
    getTransactionHistory();
    getProductAccesses();
  }, []);
  return (
    <Container maxWidth="lg">
      <div className={classes.emptySpace} />
      <Grid container direction="row" spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h2">
            <FormattedMessage id="my_account_header" />
          </Typography>
          <Divider light className={classes.sectionDivider} />
          <Grid container item direction="row" spacing={4} xs={12}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" style={{ color: "#aaa" }}>
                <FormattedMessage id="my_account_plan_profile" />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h6" className={classes.sectionTypography}>
                {defaultEmail}
              </Typography>
              <Typography variant="h6" className={classes.sectionTypography}>
                <Link
                  href="#"
                  variant="subtitle2"
                  onClick={(e: React.MouseEvent) => {
                    history.push("/password-change");
                    e.preventDefault();
                  }}
                >
                  <FormattedMessage id="password_change" />
                </Link>
              </Typography>
            </Grid>
          </Grid>
          <div className={classes.emptySpace} />
          <Grid container item direction="row" spacing={4} xs={12}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" style={{ color: "#aaa" }}>
                <FormattedMessage id="my_account_plan_details" />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Passes />
            </Grid>
          </Grid>
          <div className={classes.emptySpace} />
          <Grid container item direction="row" spacing={4} xs={12}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" style={{ color: "#aaa" }}>
                <FormattedMessage id="my_account_product_access" />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {productsInFlight ? (
                <CircularProgress />
              ) : products !== undefined ? (
                <Products products={products} />
              ) : (
                <Typography>{productsError}</Typography>
              )}
            </Grid>
          </Grid>
          <div className={classes.emptySpace} />
          <Grid container item direction="row" spacing={4} xs={12}>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                style={{ textTransform: "uppercase", color: "#aaa" }}
              >
                <FormattedMessage id="my_account_transaction_history" />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {transactionsInFlight ? (
                <CircularProgress />
              ) : transactions !== undefined ? (
                <Transactions transactions={transactions} />
              ) : (
                <Typography>{transactionsError}</Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
