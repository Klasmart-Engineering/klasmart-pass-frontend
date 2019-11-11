import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { redirectIfAuthorized, redirectIfUnverifiable } from "../components/authorized";
import BadanamuButton from "../components/button";
import BadanamuTextField from "../components/textfield";
import { useRestAPI } from "../restapi";
import { RestAPIError } from "../restapi_errors";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) => createStyles({
    "@global": {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    "paper": {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    "avatar": {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    "form": {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    "submit": {
        margin: theme.spacing(3, 0, 2),
    },
}),
);
// tslint:enable:object-literal-sort-keys

export function Verify() {
    const [verificationCode, setVerificationCode] = React.useState("");
    const [error, setError] = React.useState<JSX.Element | null>(null);
    const [verifyInFlight, setVerifyInFlight] = React.useState(false);
    const restApi = useRestAPI();

    redirectIfUnverifiable();

    async function verify(code: string) {
        if (verificationCode === "") { return; }
        if (verifyInFlight) { return; }
        try {
            setVerifyInFlight(true);
            await restApi.verify(code);
            redirectIfAuthorized();
        } catch (e) {
            if (e instanceof RestAPIError) {
                const id = e.getErrorMessageID();
                setError(<FormattedMessage id={id} />);
            }
        } finally {
            setVerifyInFlight(false);
        }
    }
    return (
        <Container component="main" maxWidth="xs" >
            <CssBaseline />
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
                    onClick={() => verify(verificationCode)}
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
