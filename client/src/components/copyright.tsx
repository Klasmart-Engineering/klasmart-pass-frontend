import Link from "@material-ui/core/Link";
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { FormattedMessage } from "react-intl";

const styles = (theme: Theme) => createStyles({});

type Props = WithStyles<typeof styles>;

class Copyright extends React.PureComponent<Props, any> {
    public render() {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                <FormattedMessage id="copyright" />
                {" © "}
                {new Date().getFullYear()}
                {" "}
                <Link color="inherit" href="https://badanamu.com/">
                    Calm Island Limited.
                </Link>{" "}
                {" All rights reserved. "}
                <Link color="inherit" href="https://kidsloop.net/en/privacy" style={{ paddingLeft: 20, textDecoration: "underline" }}>
                    Privacy Notice
                </Link>{" | "}
                <Link color="inherit" href="https://kidsloop.net/en/terms/" style={{ textDecoration: "underline" }}>
                    Terms of Use
                </Link>{" | "}
                <Link color="inherit" href="https://kidsloop.net/en/refund/" style={{ textDecoration: "underline" }}>
                    Refund Policy
                </Link>
            </Typography>
        );
    }
}

export default withStyles(styles)(Copyright);
