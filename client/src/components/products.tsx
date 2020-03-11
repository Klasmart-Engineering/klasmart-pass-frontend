import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FormattedMessage } from "react-intl";

function Product(props: { product: any }) {
    // TODO: typechecking
    const productId: string = props.product.prodId;
    const title: string = props.product.title;
    const expirationDate = new Date(props.product.expirationDate).toLocaleString();
    return (
        <React.Fragment>
            <TableRow key={`${expirationDate}-${productId}`}>
                <TableCell>{title}</TableCell>
                <TableCell>{expirationDate}</TableCell>
            </TableRow>
        </React.Fragment>
    );
}

interface Props {
    products: any[];
}

export function Products(props: Props) {
    return (
        <Paper style={{ width: "100%", overflowX: "auto" }}>
            <Table style={{ minWidth: 320 }} aria-label="product-table">
                <TableHead>
                    <TableRow>
                        <TableCell><FormattedMessage id="my_account_product_title" /></TableCell>
                        <TableCell><FormattedMessage id="my_account_product_expiration_date" /></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.products.map((product, i) => (
                            <Product product={product} key={i} />
                        ))
                    }
                </TableBody>
            </Table>
        </Paper>
    );
}
