import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as QueryString from "query-string";
import * as React from "react";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useStore } from "react-redux";
import { useHistory } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { redirectIfUnverifiable, redirectIfInvalidVeriricationToken } from "../components/authorized";
import BadanamuButton from "../components/button";
import BadanamuLogo from "../img/badanamu_logo.png";
import { useRestAPI } from "../restapi";
import { RestAPIError } from "../restapi_errors";
import { ActionTypes } from "../store/actions";
import { IdentityType } from "../utils/accountType";
import { State } from "../store/store";

const useStyles = makeStyles((theme) => createStyles({
    card: {
        display: "flex",
        alignItems: "center",
        padding: "48px 40px !important",
    },
    root: {
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid gray",
        borderRadius: 0,
        width: 200,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}),
);

export function VerifyLinkToken(props: RouteComponentProps) {
    const store = useStore();
    const classes = useStyles();
    const history = useHistory();
    const params = QueryString.parse(props.location.search);
    if (typeof params.verificationToken === "string") {
        store.dispatch({ type: ActionTypes.VERIFICATION_TOKEN, payload: { verificationToken: params.verificationToken } });
    }

    const [error, setError] = React.useState<JSX.Element | null>(null);
    const [targetLink, setTargetLink] = React.useState<string>("/login");
    const [targetButton, setTargetButton] = React.useState<JSX.Element | null>(<FormattedMessage id="login_button" />);
    const [verifyInFlight, setVerifyInFlight] = React.useState(false);
    const restApi = useRestAPI();

    async function verify(code: string, verificationToken: string) {
        if (code === "") { return; }
        if (verifyInFlight) { return; }
        try {
            setVerifyInFlight(true);
            const accountId = await restApi.verifyWithToken(verificationToken, code);
            store.dispatch({ type: ActionTypes.VERIFICATION_TOKEN, payload: { accountId } });
        } catch (e) {
            if (e instanceof RestAPIError) {
                setError(<FormattedMessage id="verify_account_failed" />);
                setTargetLink("/signup");
                setTargetButton(<FormattedMessage id="sign_up" />)
            }
        } finally {
            setVerifyInFlight(false);
        }
    }

    useEffect(() => {
        if (typeof params.code !== "string") return;
        verify(params.code, params.verificationToken as string);
    }, []);

    return (
        <Container maxWidth="xs" style={{ margin: "auto 0" }}>
            <Card>
                <CardContent className={classes.card}>
                    <Grid container direction="row" justify="center" alignItems="center" spacing={4}>
                        <Grid item xs={12} style={{ textAlign: "center" }}>
                            <img src={BadanamuLogo} style={{ marginBottom: 12 }} />
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: "center" }}>
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
                        </Grid>
                        <Grid item xs={12}>
                            <BadanamuButton
                                fullWidth
                                size="large"
                                onClick={(e) => {
                                    history.push(targetLink);
                                }}
                            >
                                {/* <FormattedMessage id="login_button" /> */}
                                {targetButton}
                            </BadanamuButton>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
}
