import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
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
import BadanamuLogo from "../img/badanamu_logo.png";
import { useRestAPI } from "../restapi";
import { RestAPIError } from "../restapi_errors";
import { State } from "../store/store";
import { useHistory } from "react-router";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) => createStyles({
    card: {
        display: "flex",
        alignItems: "center",
        padding: "48px 40px !important",
    },
    links: {
        padding: theme.spacing(4, 0),
        textAlign: "right",
    },
    formContainer: {
        width: "100%",
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
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const [resetCode, setResetCode] = useState(typeof params.code === "string" ? params.code : "");

    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);

    const history = useHistory();
    const classes = useStyles();
    const restApi = useRestAPI();

    function checkPasswordMatch() {
        if (newPassword === "") { return; }
        if (newPasswordConfirmation === "") { return; }
        const match = (newPassword !== newPasswordConfirmation);
        setPasswordMatchError(match);
    }

    async function restorePassword(e: React.FormEvent) {
        if (inFlight) { return; }
        if (newPassword !== newPasswordConfirmation) { return; }
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
        history.push("/password-changed");
    }

    return (
        <Container maxWidth="sm" style={{ margin: "auto 0" }}>
            <Card>
                <CardContent className={classes.card}>
                    <Grid container direction="column" justify="center" alignItems="center" spacing={4}>
                        <Grid item xs={12}>
                            <img src={BadanamuLogo} style={{ marginBottom: 12 }} />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5">
                                <FormattedMessage
                                    id="password_restore_heading"
                                    values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }}
                                />
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.formContainer}>
                            <form onSubmit={(e) => restorePassword(e)}>
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
                                            error={passwordMatchError}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            onBlur={() => checkPasswordMatch()}
                                            label={<FormattedMessage id="password_new" />}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <BadanamuTextField
                                            required
                                            fullWidth
                                            type="password"
                                            error={passwordMatchError}
                                            value={newPasswordConfirmation}
                                            onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                                            onBlur={() => checkPasswordMatch()}
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
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
}
