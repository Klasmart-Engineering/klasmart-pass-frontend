import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import * as React from "react";
import { FormattedMessage, RawIntlProvider } from "react-intl";
import { NavLink, Route, Switch } from "react-router-dom";
import { getIntl } from "./locale/locale";
import Login from "./pages/login";
import {Payment} from "./pages/payment";
import SignUp from "./pages/signup";
import Verify from "./pages/verify";

interface Props { }
interface State {
    intl: ReturnType<typeof getIntl>;
}

export class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const locales = [getIntl("ko"), getIntl("en")];
        this.state = { intl: locales[1] };
        this.previewLocalization(locales, 3000);
    }

    public render() {
        return (
            <RawIntlProvider value={this.state.intl}>
                <Paper square>
                    <Grid container spacing={5}>
                        <Grid item xs={2}>
                            <NavLink to="/" style={{ color: "inherit" }}>
                                <FormattedMessage id="sign_up" />
                            </NavLink>
                        </Grid>
                        <Grid item >
                            <NavLink to="/login" style={{ color: "inherit" }}>
                                <FormattedMessage id="login" />
                            </NavLink>
                        </Grid>
                        <Grid item >
                            <NavLink to="/payment" style={{ color: "inherit" }}>
                                <FormattedMessage id="payment" />
                            </NavLink>
                        </Grid>
                        <Grid item >
                            <NavLink to="/verify" style={{ color: "inherit" }}>
                                <FormattedMessage id="verify_email" />
                            </NavLink>
                        </Grid>
                    </Grid>
                </Paper>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/payment" component={Payment} />
                    <Route path="/verify" component={Verify} />
                    <Route path="/" component={SignUp} />
                </Switch>
            </RawIntlProvider>
                );
            }

    private previewLocalization(locales: Array<ReturnType<typeof getIntl>>, interval = 5000) {
                    let index = 0;
                    setInterval(() => {
                        index = (index + 1) % locales.length;
                        const intl = locales[index];
                        this.setState({intl});
                }, interval);
            }
        }
