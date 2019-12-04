import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ClassIcon from "@material-ui/icons/Class";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import BLP from "../img/logo_learning_pass.png";
import BLPPremium from "../img/logo_learning_pass_premium.png";
import { useRestAPI } from "../restapi";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) => createStyles({
    productImgContainer: {
        textAlign: "right",
        minHeight: 96,
        margin: 0,
        padding: theme.spacing(2, 0),
        [theme.breakpoints.down("xs")]: {
            minHeight: 72,
            textAlign: "left",
        },
    },
    productImg: {
        maxWidth: 192,
        [theme.breakpoints.down("xs")]: {
            maxWidth: 128,
        },
    },
}),
);

export function Passes() {
    const [passes, setPasses] = useState<any[] | undefined>(undefined);
    const [getPassesError, setGetPassesError] = useState<JSX.Element | undefined>(undefined);
    const [getPassesInFlight, setPassesInFlight] = useState(false);

    const classes = useStyles();
    const history = useHistory();
    const restApi = useRestAPI();

    async function getPasses() {
        if (getPassesInFlight) { return; }
        try {
            setPassesInFlight(true);
            const { passes: newPasses } = await restApi.getPassAccesses();
            console.log(newPasses);
            setPasses(newPasses);
        } catch (e) {
            // TODO: More specific error message
            setGetPassesError(<FormattedMessage id="ERROR_UNKOWN" />);
        } finally {
            setPassesInFlight(false);
        }
    }
    useEffect(() => { getPasses(); }, []);

    return (
        <React.Fragment>
            {
                getPassesInFlight ?
                    <CircularProgress /> :
                    passes ?
                        passes.map((pass) => <Pass pass={pass} />) :
                        getPassesError
            }
        </React.Fragment >
    );
}

interface Props {
    pass: { access: boolean, passId: string, expirationDate: number };
}

export function Pass({ pass }: Props) {
    const classes = useStyles();

    function getImage(passId: string) {
        switch (passId) {
            case "com.calmid.learnandplay.blp.premium":
                return <img src={BLPPremium} className={classes.productImg} />;
            case "com.calmid.learnandplay.blp.standard":
                return <img src={BLP} className={classes.productImg} />;
            default:
                return ClassIcon;
        }
    }

    return (
        <Grid item xs={12} className={classes.productImgContainer}>
            {getImage(pass.passId)}
        </Grid>
    );
}
