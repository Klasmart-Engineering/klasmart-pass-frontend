import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Container from "@material-ui/core/Container";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import React, { useState } from "react";
import { useStore } from "react-redux";
import { useHistory } from "react-router";
import BadanamuButton from "../components/button";
import { ActionTypes } from "../store/actions";
import { Store } from "../store/store";

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

type Plan = JSX.Element | string | number | null;

// tslint:enable:object-literal-sort-keys
function createData(name: string, blp: Plan, blpPlus: Plan) {
    return { name, blp, blpPlus };
}

function continueWithPlan(selectedPlan: string) {
    const store = useStore();
    const history = useHistory();
    store.dispatch({ type: ActionTypes.PRODUCT_ID, payload: selectedPlan });
    history.push("/login");
}

export function Landing() {
    const classes = useStyles();
    const [selectedPlan, setPlan] = useState("blp");
    const rows = [
        createData("Bada Rhyme 1", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("Bada Rhyme 2", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("Bada Genius", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("Bada Genius STEM", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("Bada Genius Nature", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("Bada Talk 1", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("Bada Talk 2", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("Bada Sound", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("Bada Read", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("Badanamu: Cadets", <ClearRoundedIcon />, <CheckRoundedIcon />),
        createData("Badanamu: Songs", <ClearRoundedIcon />, <CheckRoundedIcon />),
        createData("Badanamu: Books", <ClearRoundedIcon />, <CheckRoundedIcon />),
    ];

    return (
        <Container component="main" maxWidth="lg">
            <div className={classes.paper}>
                <Typography>STEP <b>1</b> OF <b>3</b></Typography>
                <Typography variant="h4">Choose the pass that's right for you</Typography>
                <Typography>Passes are valid for one year and billed annually</Typography>
            </div>
            <div className={classes.paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell align="center">
                                <Button value="blp" onClick={(e) => setPlan("blp")}>BLP</Button>
                            </TableCell>
                            <TableCell align="center">
                                <Button value="blpPlus" onClick={(e) => setPlan("blp+")}>BLP+</Button>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    <Typography variant="subtitle1">{row.name}</Typography>
                                </TableCell>
                                <TableCell align="center">
                                    {row.blp}
                                </TableCell>
                                <TableCell align="center">
                                    {row.blpPlus}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <BadanamuButton fullWidth size="large" onClick={(e) => { continueWithPlan(selectedPlan); }}>
                Continue with {selectedPlan}
            </BadanamuButton>
        </Container>
    );
}
