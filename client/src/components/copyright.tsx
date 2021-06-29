import Grid from "@material-ui/core/Grid";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { brandingConfig } from "../config";
import { SecondaryPolicyLink } from "./PolicyLink";

const styles = (theme: Theme) =>
  createStyles({
    responsiveTypography: {
      display: "inline",
      textAlign: "center",
      [theme.breakpoints.down("sm")]: {
        display: "block",
      },
      [theme.breakpoints.down("xs")]: {
        textAlign: "left",
      },
    },
  });

type Props = WithStyles<typeof styles>;

class Copyright extends React.PureComponent<Props, any> {
  public render() {
    return (
      <Grid item xs={12} className={this.props.classes.responsiveTypography}>
        <Typography
          variant="caption"
          color="textSecondary"
          className={this.props.classes.responsiveTypography}
        >
          <FormattedMessage id="copyright" />
          {" "}
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          className={this.props.classes.responsiveTypography}
        >
          <SecondaryPolicyLink
            href={brandingConfig.policies.privacy}
            messageId={"copyright_privacy"}
          />
          {" | "}
          <SecondaryPolicyLink
            href={brandingConfig.policies.termsAndConditions}
            messageId={"copyright_terms"}
          />
          {brandingConfig.policies?.refund && (
            <>
              {" | "}
              <SecondaryPolicyLink
                href={brandingConfig.policies?.refund}
                messageId={"copyright_refund"}
              />
            </>
          )}
        </Typography>
      </Grid>
    );
  }
}

export default withStyles(styles)(Copyright);
