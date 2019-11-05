import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import {RestAPI} from "../restapi";

interface Props {}
interface State {}

class Login extends React.Component<Props, State> {
    private api: RestAPI;
    constructor(props: Props) {
        super(props);
        this.state = {};
        this.api = RestAPI.getSingleton();
    }

    public render() {
        return (
            <Container component= "main" maxWidth= "xs" >
                <CssBaseline />
                <Typography component="h1" variant="h5">
                    <FormattedMessage id="login"/>
                </Typography>
            </Container>
        );
    }
}

export default Login;
