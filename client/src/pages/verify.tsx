import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import * as QueryString from "query-string";
import * as React from "react";
import { useEffect, useState } from "react";
import BadanamuLogo from "../img/badanamu_logo.png";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl";
import { useStore } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { redirectIfUnverifiable } from "../components/authorized";
import BadanamuButton from "../components/button";
import BadanamuTextField from "../components/textfield";
import { useRestAPI } from "../restapi";
import { RestAPIError } from "../restapi_errors";
import { ActionTypes } from "../store/actions";
import { IdentityType } from "../utils/accountType";

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

interface Props { type: IdentityType; }

export function Verify(props: Props & RouteComponentProps) {
    const store = useStore();
    const classes = useStyles();
    const [verificationCode, setVerificationCode] = useState("");
    const [error, setError] = useState<JSX.Element | null>(null);
    const [verifyInFlight, setVerifyInFlight] = useState(false);
    const restApi = useRestAPI();

    const params = QueryString.parse(props.location.search);
    if (typeof params.accountId === "string") {
        store.dispatch({ type: ActionTypes.ACCOUNT_ID, payload: { accountId: params.accountId } });
    }

    redirectIfUnverifiable();

    async function verify(code = verificationCode) {
        if (code === "") { return; }
        if (verifyInFlight) { return; }
        try {
            setVerifyInFlight(true);
            await restApi.verify(code, props.type);
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
            setVerificationCode(params.code);
            verify(params.code);
        }
    }, []);

    const type = IdentityType[props.type].toLowerCase();

    return (
        <Container maxWidth="sm" style={{ margin: "auto 0" }}>
            <Card>
                <CardContent className={classes.card}>
                    <Grid container justify="center" spacing={4}>
                        <Grid item xs={12} align="center">
                            <img src={BadanamuLogo} style={{ marginBottom: 12 }} />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5" align="center">
                                <FormattedMessage id={`verify_${type}`} />
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" align="center">
                                <FormattedMessage id={`verify_${type}_directions`} />
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <FormControl fullWidth>
                                <BadanamuTextField
                                    required
                                    fullWidth
                                    id="verify_code"
                                    label={<FormattedMessage id={`verify_${type}_code`} />}
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    inputProps={{ style: { verticalAlign: "center", fontFamily: "monospace" } }}
                                    InputProps={{
                                        endAdornment:
                                            <IconButton
                                                className={classes.iconButton}
                                                disabled={verifyInFlight}
                                                onClick={() => verify()}
                                                aria-label="submit"
                                            >
                                                {verifyInFlight ? <CircularProgress size={25} /> : <ExitToAppRoundedIcon />}
                                            </IconButton>,
                                    }}
                                />
                                {
                                    error === null ? null :
                                        <Typography color="error">
                                            {error}
                                        </Typography>
                                }
                            </FormControl>
                        </Grid>
                        {type === "email" ?
                            <React.Fragment>
                                <Grid item xs={12} style={{ textAlign: "center" }}>
                                    <CircularProgress size={25} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1" align="center">
                                        <FormattedMessage id={`verify_${type}_waiting`} />
                                    </Typography>
                                </Grid>
                            </React.Fragment> :
                            null
                        }
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
}
