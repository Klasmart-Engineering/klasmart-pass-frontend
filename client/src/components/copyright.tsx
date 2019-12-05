import Link from "@material-ui/core/Link";
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import Grid from "@material-ui/core/Grid"

const styles = (theme: Theme) => createStyles({
    responsiveTypography: {
        display: "inline",
        textAlign: "center",
        [theme.breakpoints.down("sm")]: {
            display: "block",
        },
        [theme.breakpoints.down("xs")]: {
            textAlign: "left",
        },
    }
});

type Props = WithStyles<typeof styles>;

class Copyright extends React.PureComponent<Props, any> {
    public render() {
        return (
            <Grid item xs={12} className={this.props.classes.responsiveTypography}>
                <Typography variant="caption" color="textSecondary" className={this.props.classes.responsiveTypography}>
                    <FormattedMessage id="copyright" />
                    {" © "}
                    {new Date().getFullYear()}
                    {". "}
                    <Link color="inherit" href="https://badanamu.com/">
                        <FormattedMessage id="copyright_company" />
                    </Link>{" "}
                    <FormattedMessage id="copyright_arr" />
                </Typography>
                <Typography variant="caption" color="textSecondary" className={this.props.classes.responsiveTypography}>
                    <Link color="inherit" href="https://kidsloop.net/en/privacy" style={{ textDecoration: "underline" }}>
                        <FormattedMessage id="copyright_privacy" />
                    </Link>{" | "}
                    <Link color="inherit" href="https://kidsloop.net/en/terms/" style={{ textDecoration: "underline" }}>
                        <FormattedMessage id="copyright_terms" />
                    </Link>{" | "}
                    <Link color="inherit" href="https://kidsloop.net/en/refund/" style={{ textDecoration: "underline" }}>
                        <FormattedMessage id="copyright_refund" />
                    </Link>
                </Typography>
            </Grid>
        );
    }
}

export default withStyles(styles)(Copyright);
