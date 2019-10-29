import * as CSS from "csstype";
import * as React from "react";

interface Props {}

const style: CSS.Properties = {
    color: "#222",
};

export class Hello extends React.Component<Props, {}> {
    public render() {
        return (
            <div>
                <h1 style={style}>Hello, KidsLoop!</h1>
            </div>
        );
    }
}
