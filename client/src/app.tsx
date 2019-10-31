import * as React from "react";
import { Hello } from "./components/hello";
import { Payment } from "./pages/payment";
import SignUp from "./pages/signup";

interface Props {}

export class App extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }
    public render() {
        return (
            <Payment />
        );
    }
}
