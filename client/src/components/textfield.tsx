import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
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

interface IProps extends WithStyles<typeof styles> {
    autoComplete?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    id: string;
    required?: boolean;
    type?: string | undefined;
}

class BadanamuTextField extends React.PureComponent<IProps, any> {
    public render() {
        return <TextField
                autoComplete={this.props.autoComplete}
                className={this.props.classes.txtfield}
                disabled={this.props.disabled === undefined ? false : this.props.disabled}
                fullWidth={this.props.fullWidth}
                id={this.props.id}
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
                required={this.props.required}
                type={this.props.type === undefined ? "text" : this.props.type}
                variant={"outlined"}/>;
    }
}

export default withStyles(styles)(BadanamuTextField);
