import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import BadanamuButton from "../components/button";
import BadanamuTextField from "../components/textfield";
import {RestAPI} from "../restapi";
import { RestAPIError } from "../restapi_errors";

function Copyright() {
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

// tslint:disable:object-literal-sort-keys
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
  "avatar": {
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
// tslint:enable:object-literal-sort-keys

interface IProps extends WithStyles<typeof styles> {}
interface State {
  signupInFlight: boolean;
  email?: string;
  password?: string;
  passwordErrorID: JSX.Element | null;
  emailErrorID: JSX.Element | null;
  generalErrorID: JSX.Element | null;
}

class SignUp extends React.Component<IProps, State> {
    private api: RestAPI;
    constructor(props: IProps) {
        super(props);
        this.state = {
          emailErrorID: null,
          generalErrorID: null,
          passwordErrorID: null,
          signupInFlight: false,
        };
        this.api = RestAPI.getSingleton();
    }

    public render() {
        return (
            <Container component= "main" maxWidth= "xs" >
                <CssBaseline />
                <div className={this.props.classes.paper}>
                    <img src="https://static-2-badanamu.akamaized.net/wp-content/uploads/2017/04/cropped-Badanamu-PNG-2.png" style={{ marginBottom: 12 }}/>
                    <Typography component="h1" variant="h5">
                        <FormattedMessage
                          id="create_account"
                          values={{b: (...chunks: any[]) => <strong>{chunks}</strong>}}
                        />
                    </Typography>
                    <FormControl className={this.props.classes.form}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <BadanamuTextField
                                    required
                                    fullWidth
                                    id="email"
                                    label={<FormattedMessage id="email"/>}
                                    error={this.state.emailErrorID !== null}
                                    helperText={this.state.emailErrorID}
                                    autoComplete="email"
                                    onChange={(e) => this.setState({email: e.target.value})}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <BadanamuTextField
                                    required
                                    fullWidth
                                    id="password"
                                    label={<FormattedMessage id="password"/>}
                                    type="password"
                                    error={this.state.passwordErrorID !== null}
                                    helperText={this.state.passwordErrorID}
                                    autoComplete="current-password"
                                    onChange={(e) => this.setState({password: e.target.value})}
                                />
                            </Grid>
                        </Grid>
                        <BadanamuButton
                            // type="submit"
                            fullWidth
                            size="large"
                            disabled={this.state.signupInFlight}
                            onClick={() => this.signupClick()}
                        >
                            {
                              this.state.signupInFlight ?
                                <CircularProgress size={25}/> :
                                <FormattedMessage id="sign_up_button" />
                            }
                        </BadanamuButton>
                        {
                          this.state.generalErrorID === null ? null :
                          <Typography color="error">
                            {this.state.generalErrorID}
                          </Typography>
                        }
                        <Grid container justify="flex-end">
                            <Grid item>
                              <Link href="#" variant="body2">
                                <FormattedMessage id="sign_up_already" />
                              </Link>
                            </Grid>
                        </Grid>
                      </FormControl>
                </div>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </Container>
        );
    }

    private async signupClick() {
      if (this.state.signupInFlight) {return; }
      if (this.state.email === undefined) {return; }
      if (this.state.password === undefined) {return; }
      this.setState({signupInFlight: true});
      try {
        // TODO: Get Locale
        const lang = "en";
        await this.api.signup(this.state.email, this.state.password, lang);
      } catch (restAPIError) {
        console.log(restAPIError);
        if (restAPIError instanceof RestAPIError) {
          const id = restAPIError.getErrorMessageID();
          const signupErrorMessageID = <FormattedMessage id={id}/>;
          let passwordErrorID = null;
          let emailErrorID = null;
          let generalErrorID = null;
          if (id.match(/password/i)) {passwordErrorID = signupErrorMessageID; }
          if (id.match(/email/i)) {emailErrorID = signupErrorMessageID; }
          if (emailErrorID === null && passwordErrorID === null) {generalErrorID = signupErrorMessageID; }
          this.setState({passwordErrorID, emailErrorID, generalErrorID});
        }
      } finally {
        this.setState({signupInFlight: false});
      }
    }

    private isEmailValid() {
      if (this.state.email === "") {return false; }
      // TODO: Regex check X@Y.Z
      return true;
    }

    private isPasswordValid() {
      if (this.state.password === "") {return false; }
      // TODO: Has number
      // TODO: Has capital
      return true;
    }
}

export default withStyles(styles)(SignUp);
