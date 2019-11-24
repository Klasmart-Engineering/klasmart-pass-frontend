import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import DevicesIcon from "@material-ui/icons/Devices";
import TabletIcon from "@material-ui/icons/Tablet";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useStore } from "react-redux";
import { useHistory } from "react-router";
import BadanamuButton from "../components/button";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme) => createStyles({
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
    },
}),
);

export function Introduction() {
    const state = useStore().getState();
    const selectedPlan = state.account.productId;
    const history = useHistory();
    const classes = useStyles();

    return (
        <Container maxWidth="sm">
            <Grid container justify="center" spacing={4}>
                <Grid item xs={12}>
                    <Typography align="center">STEP <b>2</b> OF <b>3</b></Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid item xs={6} style={{ textAlign: "center", margin: "0 auto" }}>
                        <TabletIcon style={{ fontSize: "4em", marginBottom: 4 }} />
                        <DevicesIcon style={{ fontSize: "6em" }} />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography align="center" variant="h4"><FormattedMessage id="intro_header" /></Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography align="center"><FormattedMessage id="intro_subheader" /></Typography>
                </Grid>
                <Grid item xs={12} style={{ textAlign: "center" }}>
                    <BadanamuButton size="large" onClick={(e) => { history.push("/signup"); }}>
                        Continue with {selectedPlan === "BLP" ?
                            <FormattedMessage id="learning_pass" /> :
                            <FormattedMessage id="learning_pass_premium" />
                        }
                    </BadanamuButton>
                    <Typography align="center">
                        <Link onClick={(e: React.MouseEvent) => history.push("/")}>Go back</Link>
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    );
}
