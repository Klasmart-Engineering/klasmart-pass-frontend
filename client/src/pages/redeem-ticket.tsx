import Container from "@material-ui/core/Container";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { redirectIfUnauthorized } from "../components/authorized";
import { useRestAPI } from "../restapi";
import { RestAPIError } from "../restapi_errors";
import * as QueryString from "query-string";
import { RouteComponentProps } from "react-router";
import { string } from "prop-types";

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
}),
);

export function RedeemTicket(props: RouteComponentProps) {
    const [inFlight, setInFlight] = React.useState(false);
    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);

    const params = QueryString.parse(props.location.search);
    const ticketId = (typeof params.ticketId === "string" ? params.ticketId : string)

    redirectIfUnauthorized("/redeem-ticket?ticketId=" + ticketId);

    const classes = useStyles();
    const restApi = useRestAPI();

    useEffect(() => {
        if (typeof ticketId === "string") {
            redeemTicket(ticketId);
        }
    }, []);

    async function redeemTicket(ticketId: string) {
        if (inFlight) { return; }
        try {
            setInFlight(true);
            await restApi.redeemTicket(ticketId)
            console.log("redeemed ticket")
        } catch (e) {
            handleError(e);
        } finally {
            setInFlight(false);
        }
    }

    function handleError(e: RestAPIError | Error) {
        if (!(e instanceof RestAPIError)) {
            console.error(e);
            return;
        }
        const id = e.getErrorMessageID();
        const errorMessage = <FormattedMessage id={id} />;
        switch (e.getErrorMessageType()) {
            default:
                setGeneralError(errorMessage);
                break;
        }
    }

    return (
        <Container maxWidth="lg" >
            <div className={classes.emptySpace} />
            {
                generalError === null ? null :
                    <Typography color="error">
                        {generalError}
                    </Typography>
            }
        </Container >
    );
}
