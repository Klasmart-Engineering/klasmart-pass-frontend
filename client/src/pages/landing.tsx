import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme) => createStyles({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
}),
);
// tslint:enable:object-literal-sort-keys

export function Landing() {
    const classes = useStyles();
    return (
        <div className={classes.paper}>
            <Typography variant="h3">&lt;Insert Landing Page&gt;</Typography>
        </div>
    );
}
