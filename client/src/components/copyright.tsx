import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
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

type PolicyLinkProps = {
  href: URL;
  messageId: string;
};

function PolicyLink({ href, messageId }: PolicyLinkProps) {
  return (
    <Link
      color="inherit"
      target="_blank"
      href={href.toString()}
      style={{ textDecoration: "underline" }}
    >
      <FormattedMessage id={messageId} />
    </Link>
  );
}

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
          {" © "}
          {new Date().getFullYear()}
          {". "}
          <Link
            color="inherit"
            target="_blank"
            href={brandingConfig.company.website}
          >
            {brandingConfig.company.officialName}
          </Link>{" "}
          <FormattedMessage id="copyright_arr" />{" "}
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          className={this.props.classes.responsiveTypography}
        >
          <PolicyLink
            href={brandingConfig.policies.privacy}
            messageId={"copyright_privacy"}
          />
          {" | "}
          <PolicyLink
            href={brandingConfig.policies.termsAndConditions}
            messageId={"copyright_terms"}
          />
          {brandingConfig.policies?.refund && (
            <>
              {" | "}
              <PolicyLink
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
