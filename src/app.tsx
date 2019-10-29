import * as React from "react";
import { Hello } from "./components/hello";

interface Props {}

export class App extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }
    public render() {
        return (
            <Hello />
        );
    }
}
