import * as React from "react";
import {Payment} from "../pages/payment";
import {hello} from "./hello-style.css";

interface Props {}

export class Hello extends React.Component<Props, {}> {
    public render() {
        return (
            <div>
                <h1 className={hello}>Hello, KidsLoop!</h1>
                <Payment />
            </div>
        );
    }
}
