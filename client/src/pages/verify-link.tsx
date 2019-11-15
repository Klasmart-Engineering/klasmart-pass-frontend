import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import * as QueryString from "query-string";
import * as React from "react";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useStore } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { redirectIfUnverifiable } from "../components/authorized";
import { useRestAPI } from "../restapi";
import { RestAPIError } from "../restapi_errors";
import { ActionTypes } from "../store/actions";

export function VerifyLink(props: RouteComponentProps) {
    const store = useStore();
    const params = QueryString.parse(props.location.search);
    if (typeof params.accountId === "string") {
        store.dispatch({ type: ActionTypes.ACCOUNT_ID, payload: { accountId: params.accountId } });
    }

    const [error, setError] = React.useState<JSX.Element | null>(null);
    const [verifyInFlight, setVerifyInFlight] = React.useState(false);
    const restApi = useRestAPI();

    async function verify(code: string) {
        if (code === "") { return; }
        if (verifyInFlight) { return; }
        try {
            setVerifyInFlight(true);
            await restApi.verify(code);
        } catch (e) {
            if (e instanceof RestAPIError) {
                const id = e.getErrorMessageID();
                setError(<FormattedMessage id={id} />);
            }
        } finally {
            setVerifyInFlight(false);
        }
    }

    useEffect(() => {
        if (typeof params.code === "string") {
            verify(params.code);
        }
    }, []);

    redirectIfUnverifiable();

    return (
        <Container maxWidth="xs" >
            <Typography component="h1" variant="h5">
                <FormattedMessage id="verify_email" />
            </Typography>
            {
                verifyInFlight ?
                    <CircularProgress size={25} /> : (
                        error !== null ?
                            <Typography color="error">
                                {error}
                            </Typography>
                            :
                            < FormattedMessage id="verify_email_success" />
                    )
            }
        </Container >
    );
}
