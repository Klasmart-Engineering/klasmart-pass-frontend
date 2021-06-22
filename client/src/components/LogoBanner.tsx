import React from "react";
import { Grid } from "@material-ui/core";

import PrimaryLogo from "@branding/assets/img/primary_logo.svg";
import { brandingConfig } from "../config";

export default function () {
  return (
    <Grid item xs={12} style={{ textAlign: "center" }}>
      <img
        alt={`${brandingConfig.company.name} Logo`}
        src={PrimaryLogo}
        style={{ marginBottom: 12 }}
        height="50px"
      />
    </Grid>
  );
}
