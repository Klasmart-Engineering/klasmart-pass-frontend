import * as React from "react";
import { connect } from "react-redux";
import { State } from "../store/store";

interface Props {}

class HelloComponent extends React.Component<Props, {}> {
    public render() {
        return (
            <div>
                <h1>Hello, KidsLoop!</h1>
            </div>
        );
    }
}

export default connect(
    (state: State) => ({}), // Function to extract data from redux store
    {}, // Functions to dispatch redux events
)(HelloComponent);
