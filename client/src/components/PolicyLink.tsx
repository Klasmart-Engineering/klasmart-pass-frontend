import React from "react";
import { Link, LinkProps } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

type PolicyLinkProps = {
  href: URL;
  messageId: string;
} & LinkProps;

export default function PolicyLink({
  href,
  messageId,
  ...rest
}: PolicyLinkProps) {
  return (
    <Link target="_blank" href={href.toString()} {...rest}>
      <FormattedMessage id={messageId} />
    </Link>
  );
}

export function PrimaryPolicyLink(props: PolicyLinkProps) {
  return <PolicyLink variant="subtitle2" {...props} />;
}

export function SecondaryPolicyLink(props: PolicyLinkProps) {
  return (
    <PolicyLink
      color="inherit"
      style={{ textDecoration: "underline" }}
      {...props}
    />
  );
}
