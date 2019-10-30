import { Dropin } from "braintree-web-drop-in";
import * as React from "react";
import DropIn from "../components/braintree-web-drop-in-react";

interface IProps { }

interface IState {
    clientToken: string;
}

export class Payment extends React.Component<IProps, IState> {
    private instance: Dropin;

    constructor(props: IProps) {
        super(props);
        this.state = {
            clientToken: "",
        };
    }

    public async componentDidMount() {
        // Get a client token for authorization from your server
        const response = await fetch("./token");
        const clientToken = await response.json(); // If returned as JSON string
        console.log(clientToken);
        this.setState({ clientToken });
    }

    public async buy() {
        // Send the nonce to your server
        const { nonce } = await this.instance.requestPaymentMethod();
        const request = {
            method: "POST",
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(nonce),
        };
        console.log(request);
        await fetch(`./payment`, request);
    }

    public render() {
        if (!this.state.clientToken) {
            return (
                <div>
                    <h1>Loading...</h1>
                </div>
            );
        } else {
            return (
                <div>
                    <DropIn
                        options={{ authorization: this.state.clientToken }}
                        onInstance={(instance) => (this.instance = instance)}
                    />
                    <button onClick={this.buy.bind(this)}>Buy</button>
                </div>
            );
        }
        }
}
