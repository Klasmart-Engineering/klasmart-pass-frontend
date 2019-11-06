import { Actions, ActionTypes } from "./actions";

export function email(state= null, action: Actions) {
    switch (action.type) {
        case ActionTypes.SET_EMAIL:
        return action.payload;
    default:
        return state;
    }
}

export function accessToken(state= null, action: Actions) {
    switch (action.type) {
        case ActionTypes.SET_ACCESS_TOKEN:
        return action.payload;
    default:
        return state;
    }
}

export function refreshToken(state= null, action: Actions) {
    switch (action.type) {
        case ActionTypes.SET_REFRESH_TOKEN:
        return action.payload;
    default:
        return state;
    }
}

export function deviceID(state= null, action: Actions) {
    switch (action.type) {
        case ActionTypes.SET_DEVICE_ID:
        return action.payload;
    default:
        return state;
    }
}

export function accountID(state= null, action: Actions) {
    switch (action.type) {
        case ActionTypes.SET_ACCOUNT_ID:
        return action.payload;
    default:
        return state;
    }
}
