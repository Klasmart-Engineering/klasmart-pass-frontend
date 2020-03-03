import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HelpRounded from "@material-ui/icons/HelpRounded";
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
        width: "100%",
        margin: "0 auto",
        [theme.breakpoints.down("sm")]: {
            width: "100%",
        },
    },
    activeSelectBtn: {
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
    },
    activeSelectedBtn: {
        backgroundColor: "#1896ea",
        boxShadow: "0px 0px 10px 0px rgba(24,150,234,1)",
    },
    inactiveSelectBtn: {
        "padding": theme.spacing(1, 2),
        "fontWeight": 600,
        "color": "black",
        "backgroundColor": "#d8efff",
        "&:hover": {
            color: "white",
            backgroundColor: "#58bcf5",
            boxShadow: "0px 0px 10px 0px rgba(24,150,234,1)",
            transform: "translateY(-1px)",
        },
    },
    spacingBtn: {
        margin: "48px 0",
        [theme.breakpoints.down("sm")]: {
            margin: "32px 0 16px 0",
            marginLeft: 0,
        },
    },
    spacingGrid: {
        marginTop: 48,
        [theme.breakpoints.down("sm")]: {
            marginTop: 32,
        },
    },
    selected: {
        textAlign: "center",
        color: "#1896ea",
        fontWeight: 600,
    },
    noMaxWidth: {
        maxWidth: "none",
        [theme.breakpoints.down("sm")]: {
            maxWidth: 300,
        },
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
    headingInner: {
        [theme.breakpoints.up("md")]: {
            paddingLeft: 20,
        },
    },
    card: {
        display: "flex",
        padding: "48px 32px !important",
    },
    emptySpace: {
        height: theme.spacing(8),
        [theme.breakpoints.down("xs")]: {
            height: theme.spacing(4),
        },
    },
    column: {
        flexBasis: "33.33%",
        textAlign: "center",
    },
    noIconPadding: {
        paddingRight: 28,
    },
    row: {
        alignItems: "center",
        padding: "12px 56px 12px 24px",
    },
    responsiveText: {
        [theme.breakpoints.down("xs")]: {
            justifyContent: "left",
        },
    },
}),
);

type Plan = JSX.Element | string | number;

// tslint:enable:object-literal-sort-keys
function createData(name: string, blp: Plan, blpPlus: Plan) {
    return { name, blp, blpPlus };
}

export function Landing() {
    const store = useStore();
    const history = useHistory();
    const classes = useStyles();

    const [selected, setSelected] = useState(true);
    const [selectedPlan, setPlan] = useState("BLPPremium");
    const [pressedTicketButton, setTicketButton] = useState(false);
    const [open, setOpen] = useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipOpen = () => {
        setOpen(true);
    };

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
        createData("Badanamu: Zoo Party ESL", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("Badanamu: Cadets", <ClearRoundedIcon />, <CheckRoundedIcon />),
        createData("Badanamu: Songs", <ClearRoundedIcon />, <CheckRoundedIcon />),
        createData("Badanamu: Books", <ClearRoundedIcon />, <CheckRoundedIcon />),
    ];
    const details = [
        // createData("learning_pass_additional_apps", 8, 10),
        createData("learning_pass_esl_lessons", "300+", "300+"),
        createData("learning_pass_program_levels", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("learning_pass_hd_content", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("learning_pass_ad_free", <CheckRoundedIcon />, <CheckRoundedIcon />),
        createData("learning_pass_animated_series", <ClearRoundedIcon />, <FormattedMessage id="landing_number_episodes" />),
        createData("learning_pass_premium_songs", <ClearRoundedIcon />, <FormattedMessage id="landing_number_minutes" />),
        createData("learning_pass_premium_apps", <ClearRoundedIcon />, 3),
        createData("learning_pass_ot_purchase", "US$20.00", "US$40.00"),
    ];

    function createPlanButton(plan: string) {
        return (
            <React.Fragment key={plan}>
                <Grid item xs={6} md={4}>
                    <Grid item xs={12} className={classes.productImgContainer}>
                        <Link
                            href="#"
                            onClick={(e: React.MouseEvent) => {
                                store.dispatch({ type: ActionTypes.PRODUCT_ID, payload: plan });
                                history.push("/payment");
                                e.preventDefault();
                            }}>
                            <img src={plan === "BLP" ? BLP : BLPPremium} className={classes.productImg} />
                        </Link>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }

    function createDetailsRow(detail: { name: string, blp: Plan, blpPlus: Plan }) {
        return (
            <React.Fragment key={detail.name}>
                <Grid container spacing={2} className={classes.row}>
                    <Grid item xs={12} md={6}>
                        <Typography className={classes.heading}><FormattedMessage id={detail.name} /></Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography className={selectedPlan === "BLPPremium" ? classes.selected : classes.notSelected}>{detail.blpPlus}</Typography>
                    </Grid>
                </Grid>
                <Divider />
            </React.Fragment>
        );
    }

    return (
        <Container maxWidth="lg" style={{ margin: "auto 0" }}>
            <Card>
                <CardContent className={classes.card}>
                    <Grid container direction="row" spacing={4}>
                        <Grid container item xs={12} justify="center">
                            <Typography variant="h4"><FormattedMessage id="landing_select_header_single" values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }} /></Typography>
                        </Grid>
                        <Grid container item xs={12} justify="center" className={classes.responsiveText}>
                            <Typography variant="body1" ><FormattedMessage id="landing_select_subheader" /></Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.emptySpace} />
                        <Grid container item justify="flex-start" xs={12} sm={6} spacing={2}>
                            <Grid item xs={12}>
                                <img src={BLPPremium} className={classes.productImg} />
                                <BadanamuButton
                                    className={pressedTicketButton ? clsx(classes.inactiveSelectBtn, classes.spacingBtn) : clsx(classes.activeSelectBtn, classes.activeSelectedBtn, classes.spacingBtn)}
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
                                <Typography variant="body1" align="center">Have a Learning Pass Ticket ID?</Typography>
                                {pressedTicketButton ?
                                    <Grid container direction="row" justify="space-between" alignItems="center" spacing={2}>
                                        <Grid item xs={12} sm={6} className={classes.spacingGrid}>
                                            <BadanamuButton
                                                className={clsx(classes.activeSelectBtn, classes.activeSelectedBtn)}
                                                fullWidth
                                                size="large"
                                                onClick={(e) => {
                                                    history.push("/redeem-ticket");
                                                }}
                                            >
                                                Redeem Ticket
                                            </BadanamuButton>
                                        </Grid>
                                        <Grid item xs={12} sm={6} className={classes.spacingGrid}>
                                            <BadanamuButton
                                                className={clsx(classes.activeSelectBtn, classes.activeSelectedBtn)}
                                                fullWidth
                                                size="large"
                                                onClick={(e) => {
                                                    history.push("/redeem-event-ticket");
                                                }}
                                            >
                                                Redeem Event Ticket
                                            </BadanamuButton>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <div style={{
                                                alignItems: "center",
                                            }}>
                                                <span style={{
                                                    display: "flex",
                                                    flexDirection: "row-reverse",
                                                }}>
                                                    <HelpRounded fontSize="small" style={{ marginLeft: 8 }} onClick={handleTooltipOpen} />
                                                    <ClickAwayListener onClickAway={handleTooltipClose}>
                                                        <Tooltip
                                                            aria-label="add"
                                                            arrow
                                                            classes={{ tooltip: classes.noMaxWidth }}
                                                            disableFocusListener
                                                            onClose={handleTooltipClose}
                                                            open={open}
                                                            placement="bottom"
                                                            title="An event ticket is a ticket ID you might have received through social media."
                                                        >
                                                            <Typography variant="caption" onClick={handleTooltipOpen}>What's an Event Ticket?</Typography>
                                                        </Tooltip>
                                                    </ClickAwayListener>
                                                </span>
                                            </div>
                                        </Grid>
                                    </Grid>
                                    : <BadanamuButton
                                        className={clsx(classes.inactiveSelectBtn, classes.spacingBtn)}
                                        fullWidth
                                        size="large"
                                        onClick={(e) => {
                                            setTicketButton(true);
                                        }}
                                    >
                                        Redeem Here
                                    </BadanamuButton>}
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Divider />
                            <ExpansionPanel elevation={0}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon fontSize={"small"} />}
                                    aria-controls="learning-apps"
                                    id="learning-apps"
                                >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Typography className={classes.heading}><FormattedMessage id="learning_pass_apps" /></Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography className={selectedPlan === "BLPPremium" ? classes.selected : classes.notSelected}>{learningApps.length}</Typography>
                                        </Grid>
                                    </Grid>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails className={classes.details}>
                                    <Grid container spacing={1} className={classes.noIconPadding}>
                                        {learningApps.map((app) => (
                                            <React.Fragment key={app.name}>
                                                <Grid item xs={12} md={10}>
                                                    <Typography className={clsx(classes.heading, classes.headingInner)}>{app.name}</Typography>
                                                </Grid>
                                                <Grid item xs={6} md={2}>
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
                    </Grid>
                </CardContent>
            </Card>
        </Container >
    );
}
