import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl/FormControl";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import BadanamuButton from "../components/button";
import BadanamuTextField from "../components/textfield";
import { RestAPI, useRestAPI } from "../restapi";
import { RestAPIError } from "../restapi_errors";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme) => createStyles({
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
export default function Login() {
    const classes = useStyles();
    const [loginInFlight, setLoginInFlight] = useState(false);

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    async function login() {
        if (loginInFlight) { return; }
        if (email === "") { return; }
        if (password === "") { return; }
        try {
            setLoginInFlight(true);
            const restApi = useRestAPI();
            await restApi.login(email, password);
        } catch (restAPIError) {
            if (restAPIError instanceof RestAPIError) {
                const id = restAPIError.getErrorMessageID();
                const errorMessage = <FormattedMessage id={id} />;
                console.log(id);
            }
        } finally {
            setLoginInFlight(false);
        }
    }
    return (
        <Container component="main" maxWidth="xs" >
            <CssBaseline />
            <Typography component="h1" variant="h5">
                <FormattedMessage id="login" />
            </Typography>
            <FormControl className={classes.form} >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <BadanamuTextField
                            required
                            fullWidth
                            id="email"
                            label={<FormattedMessage id="email" />}
                            autoComplete="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <BadanamuTextField
                            required
                            fullWidth
                            id="password"
                            label={<FormattedMessage id="password" />}
                            type="password"
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <BadanamuButton
                    fullWidth
                    size="large"
                    disabled={loginInFlight}
                    onClick={() => login()}
                >
                    {
                        loginInFlight ?
                            <CircularProgress size={25} /> :
                            <FormattedMessage id="sign_up_button" />
                    }
                </BadanamuButton>
            </FormControl>
        </Container>
    );
}
