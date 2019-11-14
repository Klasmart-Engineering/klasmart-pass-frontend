import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import DevicesIcon from "@material-ui/icons/Devices";
import TabletIcon from "@material-ui/icons/Tablet";
import React from "react";
import { useStore } from "react-redux";
import { useHistory } from "react-router";
import BadanamuButton from "../components/button";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme) => createStyles({
    paper: {
        marginTop: theme.spacing(8),
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
        <Container maxWidth="xs">
            <div className={classes.paper}>
                <Typography align="center">STEP <b>2</b> OF <b>3</b></Typography>
            </div>
            <div className={classes.paper}>
                <span style={{ margin: "0 auto" }}>
                    <TabletIcon style={{ fontSize: "4em", marginBottom: 4 }} />
                    <DevicesIcon style={{ fontSize: "6em" }} />
                </span>
                <Typography align="center" variant="h4">Create your account.</Typography>
                <Typography align="center">Use your email and create a password to access your KidsApps on any device at any time.</Typography>
            </div>
            <BadanamuButton fullWidth size="large" onClick={(e) => { history.push("/signup"); }}>
                Continue with {selectedPlan}
            </BadanamuButton>
            <Typography align="center">
                <Link onClick={(e: React.MouseEvent) => history.push("/")}>Go back</Link>
            </Typography>
        </Container>
    );
}
