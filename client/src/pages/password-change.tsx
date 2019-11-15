import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import BadanamuButton from "../components/button";
import BadanamuTextField from "../components/textfield";
import { useRestAPI } from "../restapi";
import { RestAPIError } from "../restapi_errors";

const useStyles = makeStyles((theme: Theme) => createStyles({
    form: {
        marginTop: theme.spacing(3),
        width: "100%", // Fix IE 11 issue.
    },
}),
);

export function PasswordChange() {
    const [inFlight, setInFlight] = useState(false);
    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

    const classes = useStyles();
    const history = useHistory();
    const restApi = useRestAPI();

    async function changepassword(e: React.FormEvent) {
        e.preventDefault();
        if (inFlight) { return; }
        if (newPassword === "") { return; }
        if (currentPassword === "") { return; }
        try {
            setInFlight(true);
            const result = await restApi.changePassword(currentPassword, newPassword);
            if (result.status === 200) { history.push("/password-changed"); }
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
        <Container maxWidth="xs" >

            <Typography component="h1" variant="h5">
                <FormattedMessage
                    id="password_change_heading"
                    values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }}
                />
            </Typography>
            <form className={classes.form} onSubmit={(e) => changepassword(e)}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <BadanamuTextField
                            required
                            fullWidth
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            label={<FormattedMessage id="password_current" />}
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
                            <FormattedMessage id="password_change_button" />
                    }
                </BadanamuButton>
                {
                    generalError === null ? null :
                        <Typography color="error">
                            {generalError}
                        </Typography>
                }
            </form>
        </Container>
    );
}
