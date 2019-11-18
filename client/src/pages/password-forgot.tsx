import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useStore } from "react-redux";
import { useHistory } from "react-router";
import BadanamuButton from "../components/button";
import BadanamuTextField from "../components/textfield";
import { useRestAPI } from "../restapi";
import { ActionTypes } from "../store/actions";
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
export function PasswordForgot() {
    const store = useStore();
    const [inFlight, setInFlight] = useState(false);

    const defaultEmail = useSelector((state: State) => state.account.email || "");
    const [email, setEmail] = useState(defaultEmail);

    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);

    const classes = useStyles();
    const restApi = useRestAPI();
    const history = useHistory();
    async function forgotPassword(e: React.FormEvent) {
        e.preventDefault();
        const lang = "en"; // TODO: use locale
        try {
            setInFlight(true);
            const response = await restApi.forgotPassword(email, lang);
            if (response.status === 200) {
                store.dispatch({ type: ActionTypes.EMAIL, payload: email });
                history.push("/password-restore");
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
                    <FormattedMessage id="password_forgot_heading" />
                </Typography>
                <form className={classes.form} onSubmit={(e) => forgotPassword(e)}>
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
                                <FormattedMessage id="password_forgot_button" />
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
