import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Container from "@material-ui/core/Container";
import Slide from "@material-ui/core/Slide";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import DevicesIcon from '@material-ui/icons/Devices';
import LaptopIcon from '@material-ui/icons/Laptop';
import TabletIcon from '@material-ui/icons/Tablet';
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
    planSelectBtn: {
        width: 100,
        height: 100,
        fontSize: 19,
        fontWeight: 600,
        color: "white",
        backgroundColor: "#1896ea",
    },
}),
);

type Plan = JSX.Element | string | number | null;

// tslint:enable:object-literal-sort-keys
function createData(name: string, blp: Plan, blpPlus: Plan) {
    return { name, blp, blpPlus };
}

export function Landing() {
    const store = useStore();
    const history = useHistory();
    const classes = useStyles();;
    const [step, setStep] = useState(1);
    const [selectedPlan, setPlan] = useState("BLP");
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
            <Slide direction="left" in={step === 1} timeout={{ exit: 10 }} mountOnEnter unmountOnExit>
                <Container>
                    <div className={classes.paper}>
                        <Typography>STEP <b>{step}</b> OF <b>3</b></Typography>
                        <Typography variant="h4">Choose the pass that's right for you</Typography>
                        <Typography>Passes are valid for one year and billed annually</Typography>
                    </div>
                    <div className={classes.paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell align="center">
                                        <Button className={classes.planSelectBtn} value="BLP" onClick={(e) => setPlan("BLP")}>BLP</Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button className={classes.planSelectBtn} value="BLP+" onClick={(e) => setPlan("BLP+")}>BLP+</Button>
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
                    <BadanamuButton fullWidth size="large" onClick={(e) => setStep(step + 1)}>
                        Continue with {selectedPlan}
                    </BadanamuButton>
                </Container>
            </Slide>
            <Slide direction="left" in={step === 2} timeout={{ enter: 250, exit: 1000 }} mountOnEnter unmountOnExit>
                <Container maxWidth="xs">
                    <div className={classes.paper}>
                        <Typography align="center">STEP <b>{step}</b> OF <b>3</b></Typography>
                    </div>
                    <div className={classes.paper}>
                        <span align="center">
                            <TabletIcon style={{ fontSize: "4em", marginBottom: 4 }} />
                            <DevicesIcon style={{ fontSize: "6em" }} />
                        </span>
                        <Typography align="center" variant="h4">Create your account.</Typography>
                        <Typography align="center">Use your email and create a password to access your KidsApps on any device at any time.</Typography>
                    </div>
                    <BadanamuButton fullWidth size="large" onClick={(e) => {
                        store.dispatch({ type: ActionTypes.PRODUCT_ID, payload: selectedPlan });
                        history.push("/signup");
                    }}>
                        Continue with {selectedPlan}
                    </BadanamuButton>
                </Container>
            </Slide>
        </Container>
    );
}
