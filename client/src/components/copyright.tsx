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
                <Link color="inherit" href="https://badanamu.com/">
                    Badanamu.com
                </Link>{" "}
                {new Date().getFullYear()}
                {"."}
            </Typography>
        );
    }
}

export default withStyles(styles)(Copyright);
