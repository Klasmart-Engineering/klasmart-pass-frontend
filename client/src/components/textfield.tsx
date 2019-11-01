import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import * as React from "react";

const styles = (theme: Theme) => createStyles({
    cssFocused: {
        "&$cssFocused": {
            color: "#1896ea", // focused
        },
        "color": "#1896ea",
    },
    cssLabel: {},
    cssOutlinedInput: {
        "&$cssFocused $notchedOutline": {
            borderColor: "#1896ea", // focused
        },
        "&:hover:not($disabled):not($cssFocused):not($error) $notchedOutline": {
            borderColor: "#7c8084", // hovered
        },
        "&:not(hover):not($disabled):not($cssFocused):not($error) $notchedOutline": {
            borderColor: "#c9caca", // default
        },
    },
    disabled: {},
    error: {},
    notchedOutline: {},
    txtfield: {
        "& fieldset": {
          borderRadius: 12,
        },
        "borderColor": "black",
    },
});

type Props = {["id"]: string; } &
    Omit<TextFieldProps, "id"> &
    WithStyles<typeof styles>;

class BadanamuTextField extends React.PureComponent<Props, any> {
    public render() {
        const forwardProps = {...this.props};
        delete forwardProps.classes;
        return <TextField {...forwardProps}
                className={this.props.classes.txtfield}
                InputLabelProps={{
                    classes: {
                        focused: this.props.classes.cssFocused,
                        root: this.props.classes.cssLabel,
                    },
                }}
                InputProps={{
                    classes: {
                        focused: this.props.classes.cssFocused,
                        notchedOutline: this.props.classes.notchedOutline,
                        root: this.props.classes.cssOutlinedInput,
                    },
                }}
                label={this.props.id.charAt(0).toUpperCase() + this.props.id.slice(1)}
                name={this.props.id}
                variant={"outlined"}/>;
    }
}

export default withStyles(styles)(BadanamuTextField);
