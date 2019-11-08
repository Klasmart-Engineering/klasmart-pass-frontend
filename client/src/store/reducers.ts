import { combineReducers } from "redux";
import { Actions, ActionTypes } from "./actions";

export function sessionId(state= null, action: Actions) {
    switch (action.type) {
    case ActionTypes.LOGIN:
        if (typeof action.payload === "object" &&
            typeof action.payload.sessionId === "string") {
            return action.payload.sessionId;
        }
        return null;
    default:
        return state;
    }
}

export function accountId(state= null, action: Actions) {
    switch (action.type) {
    case ActionTypes.LOGIN:
    case ActionTypes.SIGNUP:
        if (typeof action.payload === "object" &&
            typeof action.payload.accountId === "string") {
            return action.payload.accountId;
        }
        return null;
    default:
        return state;
    }
}

export function email(state= null, action: Actions) {
    switch (action.type) {
    case ActionTypes.LOGIN:
        if (typeof action.payload === "object" &&
            typeof action.payload.email === "string") {
            return action.payload.email;
        }
        return null;
    default:
        return state;
    }
}

export function refreshToken(state= null, action: Actions) {
    switch (action.type) {
    case ActionTypes.LOGIN:
        if (typeof action.payload === "object" &&
            typeof action.payload.refreshToken === "string") {
            return action.payload.refreshToken;
        }
        return null;
    default:
        return state;
    }
}

export function refreshTokenExpire(state= null, action: Actions) {
    switch (action.type) {
    case ActionTypes.LOGIN:
        if (typeof action.payload === "object" &&
            typeof action.payload.refreshTokenExpire === "number") {
            return action.payload.refreshTokenExpire;
        }
        return null;
    default:
        return state;
    }
}

export function accessToken(state= null, action: Actions) {
    switch (action.type) {
    case ActionTypes.LOGIN:
    case ActionTypes.REFRESH_SESSION:
        if (typeof action.payload === "object" &&
            typeof action.payload.accessToken === "string") {
            return action.payload.accessToken;
        }
        return null;
    default:
        return state;
    }
}

export function accessTokenExpire(state= null, action: Actions) {
    switch (action.type) {
    case ActionTypes.LOGIN:
    case ActionTypes.REFRESH_SESSION:
        if (typeof action.payload === "object" &&
            typeof action.payload.accessTokenExpire === "number") {
            return action.payload.accessTokenExpire;
        }
        return null;
    default:
        return state;
    }
}

export function deviceId(state= null, action: Actions) {
    switch (action.type) {
        case ActionTypes.DEVICE_ID:
        return action.payload;
    default:
        return state;
    }
}

export const account = combineReducers({
    accessToken,
    accessTokenExpire,
    accountId,
    deviceId,
    email,
    refreshToken,
    refreshTokenExpire,
    sessionId,
});
