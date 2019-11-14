import Fab from "@material-ui/core/Fab";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import DeveloperModeIcon from "@material-ui/icons/DeveloperMode";
import * as React from "react";
import { useState } from "react";
import { DeveloperDrawer } from "./drawer";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fab: {
            zIndex: 1000,
            margin: 0,
            top: 80,
            left: 20,
            bottom: "auto",
            right: "auto",
            position: "fixed",
        },
    }),
);
// tslint:enable:object-literal-sort-keys

export function Dev() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <DeveloperDrawer open={open} setOpen={setOpen} />
            <Fab
                className={classes.fab}
                color="primary"
                aria-label="dev"
                size="small"
                onClick={() => setOpen(!open)}
            >
                <DeveloperModeIcon />
            </Fab>
        </React.Fragment>
    );
}
