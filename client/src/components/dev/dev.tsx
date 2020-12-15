import Fab from "@material-ui/core/Fab";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import clsx from "clsx";
import * as React from "react";
import { useState } from "react";

import { DeveloperDrawer } from "./drawer";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      zIndex: 1000,
      margin: 0,
      top: 12,
      left: -20,
      bottom: "auto",
      right: "auto",
      position: "fixed",
      transition: theme.transitions.create(["left"], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.leavingScreen * 1.5,
      }),
    },
    fabShift: {
      transition: theme.transitions.create("left", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      left: 350 - 20,
    },
    rotate: {
      transition: theme.transitions.create("transform", {
        easing: theme.transitions.easing.easeIn,
        duration: 300,
      }),
      transform: "rotateY(180deg) translateX(-12px)",
    },
  })
);
// tslint:enable:object-literal-sort-keys

export function Dev() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <DeveloperDrawer open={open} setOpen={setOpen} />
      <Fab
        className={clsx(classes.fab, {
          [classes.fabShift]: open,
        })}
        color="primary"
        aria-label="dev"
        size="small"
        onClick={() => setOpen(!open)}
      >
        <ArrowRightAltIcon className={clsx({ [classes.rotate]: open })} />
      </Fab>
    </React.Fragment>
  );
}
