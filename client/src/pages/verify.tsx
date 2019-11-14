import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import * as QueryString from "query-string";
import * as React from "react";
import { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useStore } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { redirectIfUnverifiable } from "../components/authorized";
import BadanamuButton from "../components/button";
import BadanamuTextField from "../components/textfield";
import { useRestAPI } from "../restapi";
import { RestAPIError } from "../restapi_errors";
import { ActionTypes } from "../store/actions";

export function Verify(props: RouteComponentProps) {
    const store = useStore();
    const [verificationCode, setVerificationCode] = React.useState("");
    const [error, setError] = React.useState<JSX.Element | null>(null);
    const [verifyInFlight, setVerifyInFlight] = React.useState(false);
    const restApi = useRestAPI();

    redirectIfUnverifiable();

    async function verify(code = verificationCode) {
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
        const params = QueryString.parse(props.location.search);
        if (typeof params.accountId === "string") {
            store.dispatch({ type: ActionTypes.ACCOUNT_ID, payload: params.accountId });
        }
        if (typeof params.code === "string") {
            setVerificationCode(params.code);
            verify(params.code);
        }
    }, []);

    return (
        <Container maxWidth="xs" >
            <Typography component="h1" variant="h5">
                <FormattedMessage id="verify_email" />
            </Typography>
            <FormControl >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <BadanamuTextField
                            required
                            fullWidth
                            id="verify_code"
                            label={<FormattedMessage id="verify_email_code" />}
                            value={verificationCode}
                            // helperText={emailError}
                            autoComplete="email"
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <BadanamuButton
                    fullWidth
                    size="large"
                    disabled={verifyInFlight}
                    onClick={() => verify()}
                >
                    {
                        verifyInFlight ?
                            <CircularProgress size={25} /> :
                            <FormattedMessage id="verify_email_button" />
                    }
                </BadanamuButton>
                {
                    error === null ? null :
                        <Typography color="error">
                            {error}
                        </Typography>
                }
            </FormControl>
        </Container>
    );
}
