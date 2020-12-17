import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector, useStore } from "react-redux";
import { useHistory } from "react-router";

import { RootState } from "../store/rootReducer";

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

  const isAccessTokenExpired = useMemo(
    () =>
      account.accessTokenExpire
        ? parseInt(account.accessTokenExpire) < Date.now()
        : true,
    [account]
  );

  const [pendingRefreshToken, setPendingRefreshToken] = useState(false);

  // useEffect(() => {
  //   console.log({
  //     pendingRefreshToken,
  //     refreshToken: !!account.refreshToken,
  //     isAccessTokenExpired,
  //     result:
  //       !pendingRefreshToken && account.refreshToken && isAccessTokenExpired,
  //   });
  //   if (!pendingRefreshToken && account.refreshToken && isAccessTokenExpired) {
  //     console.log("enter");
  //     setPendingRefreshToken(true);
  // const params = {
  //   sessionId: account.sessionId,
  //   accountId: account.accountId,
  //   deviceId: account.deviceId,
  //   refreshToken: account.refreshToken,
  //   appId: "Webpage",
  // };

  // const refreshAccessToken = async () => {
  //   const res = await fetch(`${getAuthEndpoint()}v1/token`, {
  //     method: "post",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(params),
  //   });

  //       console.log({ params });
  //       console.log({ res });
  //     };

  //     refreshAccessToken();
  //   }
  // }, [pendingRefreshToken, account, isAccessTokenExpired]);

  // console.log({ account });

  return { isLoggedIn, isAccessTokenExpired, account };
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
