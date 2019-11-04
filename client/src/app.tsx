import * as React from "react";
import {RawIntlProvider} from "react-intl";
import { Hello } from "./components/hello";
import {getIntl} from "./locale/locale";
import { Payment } from "./pages/payment";
import SignUp from "./pages/signup";

interface Props {}
interface State {
    intl: ReturnType<typeof getIntl>;
}

export class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const locales = [getIntl("ko"), getIntl("en")];
        this.state = {intl: locales[1]};
        this.previewLocalization(locales, 1500);
    }

    public render() {
        return (
            <RawIntlProvider value={this.state.intl}>
                <SignUp />
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
