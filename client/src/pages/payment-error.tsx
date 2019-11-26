import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage } from "react-intl";

export function PaymentError() {
    return (
        <Container maxWidth="xs" >
            <Typography component="h1" variant="h5">
                <FormattedMessage id="payment_error" />
            </Typography>
        </Container>
    );
}
