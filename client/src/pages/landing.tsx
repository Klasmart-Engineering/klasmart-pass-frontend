import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Container from "@material-ui/core/Container";
import Hidden from "@material-ui/core/Hidden";
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
import DevicesIcon from "@material-ui/icons/Devices";
import LaptopIcon from "@material-ui/icons/Laptop";
import TabletIcon from "@material-ui/icons/Tablet";
import clsx from "clsx";
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
        "width": 100,
        "height": 100,
        "fontSize": 19,
        "fontWeight": 600,
        "color": "white",
        "backgroundColor": "#aedaf3",
        "&:hover": {
            color: "white",
            backgroundColor: "#58bcf5",
            boxShadow: "0px 0px 10px 0px rgba(24,150,234,1)",
            transform: "translateY(-1px)",
        },
    },
    planSelectedBtn: {
        backgroundColor: "#1896ea",
        boxShadow: "0px 0px 10px 0px rgba(24,150,234,1)",
    },
    smTableTitle: {
        borderBottom: 0,
    },
    selected: {
        color: "#1896ea",
    },
    notSelected: {
        color: "gray",
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
    const classes = useStyles();
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
        <Container maxWidth="lg">
            {/* <Container> */}
            <div className={classes.paper}>
                <Typography>STEP <b>{step}</b> OF <b>3</b></Typography>
                <Typography variant="h4">Choose the pass that's right for you</Typography>
                <Typography>Passes are valid for one year and billed annually</Typography>
            </div>
            <div className={classes.paper}>
                <Table aria-label="plan table">
                    <TableHead>
                        <TableRow>
                            <Hidden smDown>
                                <TableCell></TableCell>
                            </Hidden>
                            <TableCell align="center">
                                <Button
                                    className={clsx(classes.planSelectBtn, selectedPlan === "BLP" && classes.planSelectedBtn)}
                                    value="BLP"
                                    onClick={(e) => setPlan("BLP")}
                                >
                                    BLP
                                        </Button>
                            </TableCell>
                            <TableCell align="center">
                                <Button
                                    className={clsx(classes.planSelectBtn, selectedPlan === "BLP+" && classes.planSelectedBtn)}
                                    value="BLP+"
                                    onClick={(e) => setPlan("BLP+")}
                                >
                                    BLP+
                                        </Button>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <Hidden smDown>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="subtitle1">{row.name}</Typography>
                                    </TableCell>
                                    <TableCell align="center" className={selectedPlan === "BLP" ? classes.selected : classes.notSelected}>
                                        {row.blp}
                                    </TableCell>
                                    <TableCell align="center" className={selectedPlan === "BLP+" ? classes.selected : classes.notSelected}>
                                        {row.blpPlus}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </Hidden>
                        <Hidden mdUp>
                            {rows.map((row) => (
                                <React.Fragment>
                                    <TableRow key={row.name}>
                                        <TableCell
                                            align="center"
                                            size="small"
                                            component="th"
                                            scope="row"
                                            colSpan={2}
                                            className={classes.smTableTitle}
                                        >
                                            <Typography variant="subtitle1">{row.name}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center" className={selectedPlan === "BLP" ? classes.selected : classes.notSelected}>
                                            {row.blp}
                                        </TableCell>
                                        <TableCell align="center" className={selectedPlan === "BLP+" ? classes.selected : classes.notSelected}>
                                            {row.blpPlus}
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))}
                        </Hidden>
                    </TableBody>
                </Table>
            </div>
            <BadanamuButton
                fullWidth
                size="large"
                onClick={(e) => {
                    store.dispatch({ type: ActionTypes.PRODUCT_ID, payload: selectedPlan });
                    history.push("/introduction")
                }}
            >
                Continue with {selectedPlan}
            </BadanamuButton>
        </Container>
    );
}
