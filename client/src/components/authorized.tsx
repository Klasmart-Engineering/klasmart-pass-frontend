import React from "react";
import { useSelector, useStore } from "react-redux";
import { useHistory } from "react-router-dom";

import { ActionTypes } from "../store/actions";
import { State } from "../store/store";

export function isLoggedIn() {
  const store = useStore();
  const accessToken = useSelector((state: State) => state.account.accessToken);
  const refreshToken = useSelector(
    (state: State) => state.account.refreshToken
  );
  return accessToken === null && refreshToken === null;
}

export function redirectIfUnauthorized(returnRoute = "/") {
  const store = useStore();
  const history = useHistory();
  const accessToken = useSelector((state: State) => state.account.accessToken);
  const refreshToken = useSelector(
    (state: State) => state.account.refreshToken
  );
  const email = useSelector((state: State) => state.account.email);

  React.useEffect(() => {
    if (accessToken === null && refreshToken === null) {
      store.dispatch({
        type: ActionTypes.POST_AUTHORIZATION_ROUTE,
        payload: returnRoute,
      });
      if (!email) {
        history.replace("/signup");
      } else {
        history.replace("/login");
      }
    }
  }, [accessToken, refreshToken]);
}

export function redirectIfAuthorized(defaultRoute = "/") {
  const history = useHistory();
  const accessToken = useSelector((state: State) => state.account.accessToken);
  const refreshToken = useSelector(
    (state: State) => state.account.refreshToken
  );
  const postAuthorizationRoute = useSelector(
    (state: State) => state.postAuthorizationRoute
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
  const accountId = useSelector((state: State) => state.account.accountId);
  const accessToken = useSelector((state: State) => state.account.accessToken);
  const refreshToken = useSelector(
    (state: State) => state.account.refreshToken
  );
  const postAuthorizationRoute = useSelector(
    (state: State) => state.postAuthorizationRoute
  );

  if (accessToken !== null || refreshToken !== null || accountId === null) {
    history.replace(postAuthorizationRoute || defaultRoute);
  }
}
