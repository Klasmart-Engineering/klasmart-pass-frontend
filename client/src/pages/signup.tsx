import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import * as React from "react";
import BadanamuButton from "../components/button";
import BadanamuTextField from "../components/textfield";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://badanamu.com/">
        Badanamu.com
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const styles = (theme: Theme) => createStyles({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  "paper": {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  "form": {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  "submit": {
    margin: theme.spacing(3, 0, 2),
  },
});

interface IProps extends WithStyles<typeof styles> {}

class SignUp extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
        this.state = {};
    }

    public render() {
        return (
            <Container component= "main" maxWidth= "xs" >
                <CssBaseline />
                <div className={this.props.classes.paper}>
                    <img src="https://static-2-badanamu.akamaized.net/wp-content/uploads/2017/04/cropped-Badanamu-PNG-2.png" style={{ marginBottom: 12 }}/>
                    <Typography component="h1" variant="h5">
                        Create your <b>Badanamu Account.</b>
                    </Typography>
                    <form className={this.props.classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <BadanamuTextField
                                    required
                                    fullWidth
                                    id="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <BadanamuTextField
                                    required
                                    fullWidth
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                />
                            </Grid>
                        </Grid>
                        <BadanamuButton
                            type="submit"
                            fullWidth
                            size="large"
                        >
                            Sign Up
                        </BadanamuButton>
                        <Grid container justify="flex-end">
                            <Grid item>
                            <Link href="#" variant="body2">
                            Already have an account? Sign in
                            </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </Container>
        );
    }
}

export default withStyles(styles)(SignUp);
