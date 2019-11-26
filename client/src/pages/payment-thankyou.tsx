import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage } from "react-intl";

export function PaymentThankyou() {
    return (
        <Container maxWidth="xs" >
            <Typography component="h1" variant="h5">
                <FormattedMessage id="payment_thankyou" />
            </Typography>
        </Container>
    );
}
