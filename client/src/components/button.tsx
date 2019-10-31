import Button from "@material-ui/core/Button";
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import * as React from "react";

const styles = (theme: Theme) => createStyles({
    btn: {
        "&:hover": {
            "background": "#40b8f4",
            "box-shadow": "0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)",
            "transform": "translateY(-1px)",
        },
        "background": "#1896ea",
        "border-radius": "12px",
        "color": "white",
        "margin": theme.spacing(3, 0, 2),
    },
});

interface IProps extends WithStyles<typeof styles> {
    disabled?: boolean;
    fullWidth?: boolean;
    onClick?: () => void;
    size?: "small" | "medium" | "large" | undefined;
    type?: "button" | "submit" | "reset" | undefined;
}

class BadanamuButton extends React.PureComponent<IProps, any> {
    public render() {
        return <Button
                    className={this.props.classes.btn}
                    disabled={this.props.disabled === undefined ? false : this.props.disabled}
                    onClick={this.props.onClick}
                    size={this.props.size === undefined ? "medium" : this.props.size}
                    fullWidth={this.props.fullWidth}
                    variant="contained"
                >{this.props.children}</Button>;
    }
}

export default withStyles(styles)(BadanamuButton);
