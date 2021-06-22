import Grid from "@material-ui/core/Grid";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core/styles";
import * as React from "react";
import { brandingConfig } from "../config";
import { PrimaryPolicyLink } from "./PolicyLink";

const styles = (theme: Theme) =>
  createStyles({
    links: {
      padding: theme.spacing(4, 0),
      textAlign: "right",
      [theme.breakpoints.down("sm")]: {
        textAlign: "center",
      },
    },
  });

type Props = WithStyles<typeof styles>;

class PolicyLinks extends React.PureComponent<Props, any> {
  public render() {
    return (
      <Grid
        container
        spacing={4}
        justify="flex-end"
        className={this.props.classes.links}
      >
        {brandingConfig.policies?.help && (
          <Grid item xs={4} sm={2}>
            <PrimaryPolicyLink
              href={brandingConfig.policies?.help}
              messageId="login_help"
            />
          </Grid>
        )}
        <Grid item xs={4} sm={2}>
          <PrimaryPolicyLink
            href={brandingConfig.policies.privacy}
            messageId="login_privacy"
          />
        </Grid>
        <Grid item xs={4} sm={2}>
          <PrimaryPolicyLink
            href={brandingConfig.policies.termsAndConditions}
            messageId="login_terms"
          />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(PolicyLinks);
