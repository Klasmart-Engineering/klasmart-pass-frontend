import Link from "@material-ui/core/Link";
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { FormattedMessage } from "react-intl";

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
            <React.Fragment>
                <Typography variant="caption" color="textSecondary" className={this.props.classes.responsiveTypography}>
                    <FormattedMessage id="copyright" />
                    {" © "}
                    {new Date().getFullYear()}
                    {" "}
                    <Link color="inherit" href="https://badanamu.com/">
                        Calm Island Limited.
                    </Link>{" "}
                    {" All rights reserved. "}
                </Typography>
                <Typography variant="caption" color="textSecondary" className={this.props.classes.responsiveTypography}>
                    <Link color="inherit" href="https://kidsloop.net/en/privacy" style={{ textDecoration: "underline" }}>
                        Privacy Notice
                    </Link>{" | "}
                    <Link color="inherit" href="https://kidsloop.net/en/terms/" style={{ textDecoration: "underline" }}>
                        Terms of Use
                    </Link>{" | "}
                    <Link color="inherit" href="https://kidsloop.net/en/refund/" style={{ textDecoration: "underline" }}>
                        Refund Policy
                    </Link>
                </Typography>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Copyright);
