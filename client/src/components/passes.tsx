import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { FormattedDate, FormattedMessage } from "react-intl";
import { useStore } from "react-redux";
import { updatePassAccesses } from "../store/slices/account";

import { useRestAPI } from "../restapi";
import { getImgByPassId } from "./../config";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    productExpiration: {
      textAlign: "right",
      [theme.breakpoints.down("xs")]: {
        textAlign: "left",
      },
    },
  })
);

export function Passes() {
  const [passes, setPasses] = useState<any[] | undefined>(undefined);
  const [getPassesError, setGetPassesError] = useState<JSX.Element | undefined>(
    undefined
  );
  const [getPassesInFlight, setPassesInFlight] = useState(false);

  const store = useStore();
  const restApi = useRestAPI();
  // const { isAccessTokenExpired } = useAuthState();

  async function getPasses() {
    if (getPassesInFlight) {
      return;
    }
    try {
      setPassesInFlight(true);
      const { passes: newPasses } = await restApi.getPassAccesses();
      setPasses(newPasses);
      store.dispatch(updatePassAccesses({ passAccesses: newPasses }));
    } catch (e) {
      // TODO: More specific error message
      setGetPassesError(<FormattedMessage id="ERROR_UNKOWN" />);
    } finally {
      setPassesInFlight(false);
    }
  }

  // useEffect(() => {
  //   if (!isAccessTokenExpired) {
  //     getPasses();
  //   }
  // }, [isAccessTokenExpired]);

  return (
    <React.Fragment>
      {getPassesInFlight ? (
        <CircularProgress />
      ) : passes ? (
        passes.map((pass, i) => <Pass pass={pass} key={i} />)
      ) : (
        getPassesError
      )}
    </React.Fragment>
  );
}

interface Props {
  pass: { access: boolean; passId: string; expirationDate: number };
}

export function Pass({ pass }: Props) {
  const classes = useStyles();
  return (
    <Grid item xs={12} key={pass.passId}>
      <Grid item className={classes.productImgContainer}>
        <img
          src={getImgByPassId(pass.passId)}
          alt={getImgByPassId(pass.passId)}
          aria-label={getImgByPassId(pass.passId)}
          className={classes.productImg}
        />
      </Grid>
      <Grid item>
        <Typography variant="subtitle2" className={classes.productExpiration}>
          <FormattedMessage
            id="learning_pass_valid_until"
            values={{
              date: <FormattedDate value={pass.expirationDate} />,
            }}
          />
        </Typography>
      </Grid>
    </Grid>
  );
}
