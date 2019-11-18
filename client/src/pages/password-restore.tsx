import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as QueryString from "query-string";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import BadanamuButton from "../components/button";
import BadanamuTextField from "../components/textfield";
import { useRestAPI } from "../restapi";
import { RestAPIError } from "../restapi_errors";
import { State } from "../store/store";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) => createStyles({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
}),
);
// tslint:enable:object-literal-sort-keys
export function PasswordRestore(props: RouteComponentProps) {
    const [inFlight, setInFlight] = useState(false);
    const params = QueryString.parse(props.location.search);

    const defaultEmail = params.email || useSelector((state: State) => state.account.email || "");
    const [email, setEmail] = useState(defaultEmail);
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
    const [resetCode, setResetCode] = useState(typeof params.code === "string" ? params.code : "");

    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);

    const classes = useStyles();
    const restApi = useRestAPI();
    async function restorePassword(e: React.FormEvent) {
        e.preventDefault();
        const lang = "en"; // TODO: use locale
        try {
            setInFlight(true);
            await restApi.restorePassword(email, newPassword, resetCode);
        } catch (e) {
            if (e instanceof RestAPIError) {
                const id = e.getErrorMessageID();
                setGeneralError(<FormattedMessage id={id} />);
            }
        } finally {
            setInFlight(false);
        }
    }

    return (
        <Container maxWidth="xs" >
            <div className={classes.paper}>
                <img src="https://static-2-badanamu.akamaized.net/wp-content/uploads/2017/04/cropped-Badanamu-PNG-2.png" style={{ marginBottom: 12 }} />
                <Typography component="h1" variant="h5">
                    <FormattedMessage id="password_restore_heading" />
                </Typography>
                <form className={classes.form} onSubmit={(e) => restorePassword(e)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <BadanamuTextField
                                required
                                fullWidth
                                autoComplete="email"
                                label={<FormattedMessage id="email" />}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <BadanamuTextField
                                required
                                fullWidth
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                label={<FormattedMessage id="password_new" />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <BadanamuTextField
                                required
                                fullWidth
                                type="password"
                                value={newPasswordConfirmation}
                                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                                label={<FormattedMessage id="password_new_confirmation" />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <BadanamuTextField
                                required
                                fullWidth
                                value={resetCode}
                                onChange={(e) => setResetCode(e.target.value)}
                                label={<FormattedMessage id="password_restore_code" />}
                            />
                        </Grid>
                    </Grid>
                    <BadanamuButton
                        type="submit"
                        fullWidth
                        size="large"
                        disabled={inFlight}
                    >
                        {
                            inFlight ?
                                <CircularProgress size={25} /> :
                                <FormattedMessage id="password_restore_button" />
                        }
                    </BadanamuButton>
                    {
                        generalError === null ? null :
                            <Typography color="error">
                                {generalError}
                            </Typography>
                    }
                </form>
            </div>
        </Container>

    );
}
