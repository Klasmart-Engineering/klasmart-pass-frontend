import Button from "@material-ui/core/Button";
import Collapse from '@material-ui/core/Collapse';
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import React, { useState } from "react";
import { FormattedDate, FormattedMessage } from "react-intl";
import { useStore } from "react-redux";
import { useHistory } from "react-router";
import BadanamuButton from "../components/button";
import BLP from "../img/logo_learning_pass.png";
import BLPPremium from "../img/logo_learning_pass_premium.png";
import { ActionTypes } from "../store/actions";
import { getExpiration } from "../utils/date";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme) => createStyles({
    productImgContainer: {
        textAlign: "center",
        minHeight: 90,
        marginLeft: 16,
        [theme.breakpoints.down("sm")]: {
            minHeight: 70,
            marginLeft: 0,
        },
    },
    productImg: {
        maxWidth: 200,
        [theme.breakpoints.down("sm")]: {
            maxWidth: 150,
        },
    },
    planSelectBtn: {
        "padding": theme.spacing(1, 2),
        "fontWeight": 600,
        "color": "white",
        "backgroundColor": "#aedaf3",
        "&:hover": {
            color: "white",
            backgroundColor: "#58bcf5",
            boxShadow: "0px 0px 10px 0px rgba(24,150,234,1)",
            transform: "translateY(-1px)",
        },
        "marginLeft": 16,
        [theme.breakpoints.down("sm")]: {
            marginTop: 16,
            marginLeft: 0,
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
        textAlign: "center",
        color: "#1896ea",
        fontWeight: 600,
    },
    notSelected: {
        textAlign: "center",
        color: "gray",
    },
    heading: {
        [theme.breakpoints.down("sm")]: {
            textAlign: "center",
        },
    },
    icon: {
        verticalAlign: "bottom",
        height: 20,
        width: 20,
    },
    details: {
        alignItems: "center",
        [theme.breakpoints.up("md")]: {
            padding: "0 24px",
        },
    },
    columnHead: {
        flexBasis: "33.33%",
    },
    headingInner: {
        [theme.breakpoints.up("md")]: {
            paddingLeft: 20,
        },
    },
    column: {
        flexBasis: "33.33%",
        textAlign: "center",
    },
    noIconPadding: {
        paddingRight: 28,
    },
    noIconMargin: {
        [theme.breakpoints.up("md")]: {
            marginRight: 48,
        },
    },
    row: {
        alignItems: "center",
        padding: "12px 56px 12px 24px",
    },
}),
);

type Plan = JSX.Element | string | number;

// tslint:enable:object-literal-sort-keys
function createData(name: string | JSX.Element, blp: Plan, blpPlus: Plan) {
    return { name, blp, blpPlus };
}

export function Landing() {
    const store = useStore();
    const history = useHistory();
    const classes = useStyles();
    const [selected, setSelected] = useState(false);
    const [selectedPlan, setPlan] = useState("BLP");
    const learningApps = [
        createData("Badanamu: Bada Rhyme 1", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("Badanamu: Bada Rhyme 2", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("Badanamu: Bada Genius", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("Badanamu: Bada Genius STEM", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("Badanamu: Bada Genius Nature", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("Badanamu: Bada Talk 1", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("Badanamu: Bada Talk 2", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("Badanamu: Bada Sound", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("Badanamu: Bada Read", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("Badanamu: Dino Park ESL", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("Badanamu: Cadets", <ClearRoundedIcon />, <CheckRoundedIcon />),
        createData("Badanamu: Songs", <ClearRoundedIcon />, <CheckRoundedIcon />),
        createData("Badanamu: Books", <ClearRoundedIcon />, <CheckRoundedIcon />),
    ];
    const details = [
        createData(<FormattedMessage id="learning_pass_additional_apps" />, 8, 10),
        createData(<FormattedMessage id="learning_pass_esl_lessons" />, "300+", "300+"),
        createData(<FormattedMessage id="learning_pass_program_levels" />, <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData(<FormattedMessage id="learning_pass_hd_content" />, <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData(<FormattedMessage id="learning_pass_ad_free" />, <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData(<FormattedMessage id="learning_pass_animated_series" />, <ClearRoundedIcon />, <FormattedMessage id="landing_number_episodes" />),
        createData(<FormattedMessage id="learning_pass_premium_songs" />, <ClearRoundedIcon />, <FormattedMessage id="landing_number_minutes" />),
        createData(<FormattedMessage id="learning_pass_premium_apps" />, <ClearRoundedIcon />, 5),
        createData(<FormattedMessage id="learning_pass_ot_purchase" />, "US$20.00", "US$50.00"),
    ];

    function createPlanButton(plan: string) {
        return (
            <React.Fragment>
                <Grid item xs={6} md={4}>
                    <Grid item xs={12} className={classes.productImgContainer}>
                        <img src={plan === "BLP" ? BLP : BLPPremium} className={classes.productImg} />
                    </Grid>
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <BadanamuButton
                            className={clsx(classes.planSelectBtn, selectedPlan === plan && classes.planSelectedBtn)}
                            value={plan}
                            onClick={(e) => {
                                setSelected(true);
                                setPlan(plan);
                            }}
                        >
                            <FormattedMessage id="button_select" />
                        </BadanamuButton>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }

    function createDetailsRow(detail: { name: string | JSX.Element, blp: Plan, blpPlus: Plan }) {
        return (
            <React.Fragment>
                <Grid container spacing={2} className={classes.row}>
                    <Grid item xs={12} md={4}>
                        <Typography className={classes.heading}>{detail.name}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <Typography className={selectedPlan === "BLP" ? classes.selected : classes.notSelected}>{detail.blp}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <Typography className={selectedPlan === "BLPPremium" ? classes.selected : classes.notSelected}>{detail.blpPlus}</Typography>
                    </Grid>
                </Grid>
                <Divider />
            </React.Fragment>
        );
    }

    return (
        <Container maxWidth="lg">
            {/* Onboarding */}
            <Grid container spacing={2} style={{ margin: "32px 0" }}>
                <Grid item xs={12}>
                    <Typography variant="h4">
                        <FormattedMessage id="landing_select_header" values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }} />
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        <FormattedMessage id="landing_select_subheader" />
                    </Typography>
                </Grid>
            </Grid>
            {/* Plan Selection Button */}
            <Grid container spacing={2}>
                <Grid container item xs={12} className={classes.noIconMargin}>
                    <Grid item xs={12} md={4} />
                    {createPlanButton("BLP")}
                    {createPlanButton("BLPPremium")}
                </Grid>
                <Grid container item xs={12}>
                    <Grid item xs={12} md={4} />
                    <Grid item xs={12} md={8}>
                        <Collapse in={selected}>
                            <BadanamuButton
                                fullWidth
                                size="large"
                                onClick={(e) => {
                                    store.dispatch({ type: ActionTypes.PRODUCT_ID, payload: selectedPlan });
                                    history.push("/payment");
                                }}
                            >
                                <FormattedMessage id="learning_pass_continue_btn" /> {selectedPlan === "BLP" ?
                                    <FormattedMessage id="learning_pass" /> :
                                    <FormattedMessage id="learning_pass_premium" />
                                }
                            </BadanamuButton>
                        </Collapse>
                    </Grid>
                </Grid>
                {/* Plan comparison */}
                <Grid item xs={12}>
                    <Divider />
                    <ExpansionPanel elevation={0}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon fontSize={"small"} />}
                            aria-controls="learning-apps"
                            id="learning-apps"
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <Typography className={classes.heading}><FormattedMessage id="learning_pass_apps" /></Typography>
                                </Grid>
                                <Grid item xs={6} md={4}>
                                    <Typography className={selectedPlan === "BLP" ? classes.selected : classes.notSelected}>10</Typography>
                                </Grid>
                                <Grid item xs={6} md={4}>
                                    <Typography className={selectedPlan === "BLPPremium" ? classes.selected : classes.notSelected}>13</Typography>
                                </Grid>
                            </Grid>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className={classes.details}>
                            <Grid container spacing={1} className={classes.noIconPadding}>
                                {learningApps.map((app) => (
                                    <React.Fragment>
                                        <Grid item xs={12} md={4}>
                                            <Typography className={clsx(classes.heading, classes.headingInner)}>{app.name}</Typography>
                                        </Grid>
                                        <Grid item xs={6} md={4}>
                                            <Typography className={selectedPlan === "BLP" ? classes.selected : classes.notSelected}>{app.blp}</Typography>
                                        </Grid>
                                        <Grid item xs={6} md={4}>
                                            <Typography className={selectedPlan === "BLPPremium" ? classes.selected : classes.notSelected}>{app.blpPlus}</Typography>
                                        </Grid>
                                    </React.Fragment>
                                ))}
                            </Grid>

                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <Divider />
                    {details.map((detail) => (
                        createDetailsRow(detail)
                    ))}
                </Grid>
                <Grid item xs={12}>
                    <BadanamuButton
                        fullWidth
                        size="large"
                        onClick={(e) => {
                            store.dispatch({ type: ActionTypes.PRODUCT_ID, payload: selectedPlan });
                            history.push("/payment");
                        }}
                    >
                        <FormattedMessage id="learning_pass_continue_btn" /> {selectedPlan === "BLP" ?
                            <FormattedMessage id="learning_pass" /> :
                            <FormattedMessage id="learning_pass_premium" />
                        }
                    </BadanamuButton>
                </Grid>
            </Grid>
        </Container>
    );
}
