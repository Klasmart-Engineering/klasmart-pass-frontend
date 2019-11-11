import { useStore } from "react-redux";
import { useHistory } from "react-router";
import { ActionTypes } from "../store/actions";
import { State } from "../store/store";

export function isLoggedIn() {
    const store = useStore();
    const {
        account: {
            accessToken,
            refreshToken,
        },
    }: State = store.getState();
    return (accessToken === null && refreshToken === null);
}

export function redirectIfUnauthorized(returnRoute = "/", to = "/login") {
    const store = useStore();
    const history = useHistory();
    const {
        account: {
            accessToken,
            refreshToken,
        },
    }: State = store.getState();

    if (accessToken === null && refreshToken === null) {
        store.dispatch({ type: ActionTypes.POST_AUTHORIZATION_ROUTE, payload: returnRoute });
        history.push(to);
    }
}

export function redirectIfAuthorized(defaultRoute = "/") {
    const store = useStore();
    const history = useHistory();
    const {
        account: {
            accessToken,
            refreshToken,
        },
        postAuthorizationRoute,
    }: State = store.getState();

    if (accessToken !== null || refreshToken !== null) {
        history.push(postAuthorizationRoute || defaultRoute);
    }
}

export function redirectIfUnverifiable(defaultRoute = "/") {
    const store = useStore();
    const history = useHistory();
    const {
        account: {
            accountId,
            accessToken,
            refreshToken,
        },
        postAuthorizationRoute,
    }: State = store.getState();

    if ((accessToken !== null || refreshToken !== null) || accountId === null) {
        history.push(postAuthorizationRoute || defaultRoute);
    }
}
