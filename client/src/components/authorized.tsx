import React from "react";
import { shallowEqual, useSelector, useStore } from "react-redux";
import { useHistory } from "react-router";
import { RootState } from "../store/rootReducer";

import { ActionTypes } from "../store/actions";

export function useAuthState() {
  const { account } = useSelector((state: RootState) => {
    return {
      account: state.account,
    };
  }, shallowEqual);

  const isLoggedIn = React.useMemo(() => {
    return (
      account != null &&
      account.accessToken != null &&
      account.refreshToken != null
    );
  }, [account]);

  console.log({ isLoggedIn });

  return { isLoggedIn, account };
}

export function redirectIfAuthorized(defaultRoute = "/") {
  const history = useHistory();
  const accessToken = useSelector(
    (state: RootState) => state.account.accessToken
  );
  const refreshToken = useSelector(
    (state: RootState) => state.account.refreshToken
  );
  const postAuthorizationRoute = useSelector(
    (state: RootState) => state.postAuthorizationRoute
  );

  React.useEffect(() => {
    if (accessToken !== null || refreshToken !== null) {
      history.replace(postAuthorizationRoute || defaultRoute);
    }
  }, [accessToken, refreshToken]);
}

export function redirectIfUnverifiable(defaultRoute = "/") {
  const store = useStore();
  const history = useHistory();
  const accountId = useSelector((state: RootState) => state.account.accountId);
  const accessToken = useSelector(
    (state: RootState) => state.account.accessToken
  );
  const refreshToken = useSelector(
    (state: RootState) => state.account.refreshToken
  );
  const postAuthorizationRoute = useSelector(
    (state: RootState) => state.postAuthorizationRoute
  );

  if (accessToken !== null || refreshToken !== null || accountId === null) {
    history.replace(postAuthorizationRoute || defaultRoute);
  }
}
