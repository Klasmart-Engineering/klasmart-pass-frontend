import * as React from "react";
import { Provider } from "react-redux";
import Hello from "./components/hello";
import { Store } from "./store/store";

interface Props {
    store: Store
}
export class App extends React.Component<Props, {}> {
    private store: Store

    constructor(props: Props) {
        super(props);
        this.store = this.props.store
    }
    public render() {
        return (
            <Provider store={this.store} >
                <Hello />
            </Provider>
        );
    }
}
