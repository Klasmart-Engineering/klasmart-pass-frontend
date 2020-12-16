import {
  Accordion as ExpansionPanel,
  AccordionDetails as ExpansionPanelDetails,
  AccordionSummary as ExpansionPanelSummary,
  Hidden,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HelpRounded from "@material-ui/icons/HelpRounded";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import BadanamuButton from "../components/button";
import { useRestAPI } from "../restapi";
import { RootState } from "../store/rootReducer";
import { Pass, setAllPasses } from "../store/slices/pass";
import { getDetailsByPass, getImgByPassId } from "./../config";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme) =>
  createStyles({
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
      padding: theme.spacing(1, 2),
      fontWeight: 600,
      color: "white",
      backgroundColor: "#aedaf3",
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
      padding: theme.spacing(1, 2),
      fontWeight: 600,
      color: "black",
      backgroundColor: "#d8efff",
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
  })
);

export function Landing() {
  const { allPasses: passList } = useSelector((state: RootState) => state.pass);

  const dispatch = useDispatch();

  const history = useHistory();
  const classes = useStyles();
  const restApi = useRestAPI();
  const whitelist = [
    {
      prodId: "app.learnandplay.bada-rhyme-1",
      title: "Badanamu: Bada Rhyme 1",
      type: 5,
      description: "",
      updateTm: 0,
    },
    {
      prodId: "app.learnandplay.bada-rhyme-2",
      title: "Badanamu: Bada Rhyme 2",
      type: 5,
      description: "",
      updateTm: 0,
    },
    {
      prodId: "app.learnandplay.bada-genius",
      title: "Badanamu: Bada Genius",
      type: 5,
      description: "",
      updateTm: 0,
    },
    {
      prodId: "app.learnandplay.bada-genius-stem",
      title: "Badanamu: Bada Genius STEM",
      type: 5,
      description: "",
      updateTm: 0,
    },
    {
      prodId: "app.learnandplay.bada-genius-nature",
      title: "Badanamu: Bada Genius Nature",
      type: 5,
      description: "",
      updateTm: 0,
    },
    {
      prodId: "app.learnandplay.bada-talk-1",
      title: "Badanamu: Bada Talk 1",
      type: 5,
      description: "",
      updateTm: 0,
    },
    {
      prodId: "app.learnandplay.bada-talk-2",
      title: "Badanamu: Bada Talk 2",
      type: 5,
      description: "",
      updateTm: 0,
    },
    {
      prodId: "app.learnandplay.bada-sound",
      title: "Badanamu: Bada Sound",
      type: 5,
      description: "",
      updateTm: 0,
    },
    {
      prodId: "app.learnandplay.bada-read",
      title: "Badanamu: Bada Read",
      type: 5,
      description: "",
      updateTm: 0,
    },
    {
      prodId: "app.learnandplay.dino-park-esl",
      title: "Badanamu: Dino Park ESL",
      type: 5,
      description: "",
      updateTm: 0,
    },
    {
      prodId: "app.learnandplay.songs",
      title: "Badanamu: Songs",
      type: 5,
      description: "",
      updateTm: 0,
    },
    {
      prodId: "app.learnandplay.books",
      title: "Badanamu: Books",
      type: 5,
      description: "",
      updateTm: 0,
    },
    {
      prodId: "app.learnandplay.cadets",
      title: "Badanamu Cadets",
      type: 5,
      description: "",
      updateTm: 0,
    },
  ];

  const passDetails = useMemo(
    () => passList.map((pass) => getDetailsByPass(pass)),
    [passList]
  );

  const [pressedTicketButton, setTicketButton] = useState(false);

  const [passListError, setPassListError] = useState<JSX.Element | undefined>(
    undefined
  );
  const [passListInFlight, setPassListInFlight] = useState(false);

  async function getPassList() {
    if (passListInFlight) {
      return;
    }
    try {
      setPassListInFlight(true);
      const passes: Pass[] = await restApi.getPassList();
      passes.sort(
        (passA: Pass, passB: Pass) =>
          parseInt(passA.price) - parseInt(passB.price)
      );

      dispatch(setAllPasses({ allPasses: passes }));
    } catch (e) {
      // TODO: More specific error message
      setPassListError(<FormattedMessage id="ERROR_UNKOWN" />);
    } finally {
      setPassListInFlight(false);
    }
  }

  useEffect(() => {
    getPassList();
  }, []);

  function createPassDetailsRow(detail) {
    return (
      <React.Fragment key={detail.name}>
        <Grid container spacing={2} className={classes.row}>
          <Grid item xs={12} md={6}>
            <Typography className={classes.heading}>
              <FormattedMessage id={detail.name} />
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography className={classes.selected}>{detail.value}</Typography>
          </Grid>
        </Grid>
        <Divider />
      </React.Fragment>
    );
  }

  function createPassPresentation(pass: Pass, idx: number) {
    return (
      <React.Fragment key={pass.passId}>
        <Grid item xs={12} className={classes.emptySpace} />
        <Grid container item justify="flex-start" xs={12} sm={6} spacing={2}>
          <Grid item xs={12}>
            <img
              src={getImgByPassId(pass.passId)}
              className={classes.productImg}
            />
            <BadanamuButton
              className={
                pressedTicketButton
                  ? clsx(classes.inactiveSelectBtn, classes.spacingBtn)
                  : clsx(
                      classes.activeSelectBtn,
                      classes.activeSelectedBtn,
                      classes.spacingBtn
                    )
              }
              fullWidth
              size="large"
              onClick={(e) => {
                console.log({ pass });
                history.push({
                  pathname: `/payment/${pass.passId}`,
                });
              }}
            >
              <FormattedMessage id="learning_pass_continue_btn" />
            </BadanamuButton>
            <Typography variant="body1" align="center">
              <FormattedMessage id="landing_tooltip_label" />
            </Typography>
            {pressedTicketButton ? (
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
                spacing={2}
              >
                <Grid item xs={12} sm={6} className={classes.spacingGrid}>
                  <BadanamuButton
                    className={clsx(
                      classes.activeSelectBtn,
                      classes.activeSelectedBtn
                    )}
                    fullWidth
                    size="large"
                    onClick={(e) => {
                      history.push("/redeem-ticket");
                    }}
                  >
                    <FormattedMessage id="ticket_redeem_btn" />
                  </BadanamuButton>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.spacingGrid}>
                  <BadanamuButton
                    className={clsx(
                      classes.activeSelectBtn,
                      classes.activeSelectedBtn
                    )}
                    fullWidth
                    size="large"
                    onClick={(e) => {
                      history.push("/redeem-event-ticket");
                    }}
                  >
                    <FormattedMessage id="landing_event_ticket_redeem_btn" />
                  </BadanamuButton>
                </Grid>
                <Grid item xs={12}>
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Hidden smDown>
                      <span
                        style={{
                          display: "flex",
                          flexDirection: "row-reverse",
                        }}
                      >
                        <Tooltip
                          title={<FormattedMessage id="landing_tooltip_text" />}
                        >
                          <HelpRounded
                            fontSize="small"
                            style={{ marginLeft: 8 }}
                          />
                        </Tooltip>
                        <Typography variant="caption">
                          <FormattedMessage id="landing_tooltip_label" />
                        </Typography>
                      </span>
                    </Hidden>
                    <Hidden mdUp>
                      <span style={{ display: "flex" }}>
                        <FormattedMessage id="landing_tooltip_text" />
                      </span>
                    </Hidden>
                  </div>
                </Grid>
              </Grid>
            ) : (
              <BadanamuButton
                className={clsx(classes.inactiveSelectBtn, classes.spacingBtn)}
                fullWidth
                size="large"
                onClick={(e) => {
                  setTicketButton(true);
                }}
              >
                <FormattedMessage id="landing_event_ticket_redeem_here_btn" />
              </BadanamuButton>
            )}
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
                  <Typography className={classes.heading}>
                    <FormattedMessage id="learning_pass_apps" />
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography className={classes.selected}>
                    {whitelist.length}
                  </Typography>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
              <Grid container spacing={1} className={classes.noIconPadding}>
                {whitelist.map((product: any) => (
                  <React.Fragment key={product.prodId}>
                    <Grid item xs={12} md={10}>
                      <Typography
                        className={clsx(classes.heading, classes.headingInner)}
                      >
                        {product.title}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <Typography className={classes.selected}>
                        <CheckRoundedIcon />
                      </Typography>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <Divider />
          {passDetails[idx] && passDetails[idx].length > 0
            ? passDetails[idx].map((detail) => createPassDetailsRow(detail))
            : null}
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <Container maxWidth="lg" style={{ margin: "auto 0" }}>
      <Card>
        <CardContent className={classes.card}>
          <Grid container direction="row" spacing={4}>
            <Grid container item xs={12} justify="center">
              <Typography variant="h4">
                <FormattedMessage
                  id="landing_select_header_single"
                  values={{
                    b: (...chunks: any[]) => <strong>{chunks}</strong>,
                  }}
                />
              </Typography>
            </Grid>
            <Grid
              container
              item
              xs={12}
              justify="center"
              className={classes.responsiveText}
            >
              <Typography variant="body1">
                <FormattedMessage id="landing_select_subheader" />
              </Typography>
            </Grid>
            {passListInFlight ? (
              <CircularProgress />
            ) : passList !== undefined ? (
              passList.map((pass: Pass, idx) =>
                createPassPresentation(pass, idx)
              )
            ) : (
              <Typography>{passListError}</Typography>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
