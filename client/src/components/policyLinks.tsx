import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { FormattedMessage } from "react-intl";

const styles = (theme: Theme) => createStyles({
    links: {
        padding: theme.spacing(4, 0),
        textAlign: "right",
        [theme.breakpoints.down("sm")]: {
            textAlign: "center",
        },
    },
});

type Props = WithStyles<typeof styles>;

class PolicyLink extends React.PureComponent<Props, any> {
    public render() {
        return (
            <Grid container spacing={4} justify="flex-end" className={this.props.classes.links}>
                <Grid item xs={4} sm={2}>
                    <Link
                        href="#"
                        variant="subtitle2"
                    >
                        <FormattedMessage id="login_help" />
                    </Link>
                </Grid>
                <Grid item xs={4} sm={2}>
                    <Link
                        href="#"
                        variant="subtitle2"
                    >
                        <FormattedMessage id="login_privacy" />
                    </Link>
                </Grid>
                <Grid item xs={4} sm={2}>
                    <Link
                        href="#"
                        variant="subtitle2"
                    >
                        <FormattedMessage id="login_terms" />
                    </Link>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(PolicyLink);
