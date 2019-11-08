import { useStore } from "react-redux";
import { RestAPIError, RestAPIErrorType } from "./restapi_errors";
import { ActionTypes } from "./store/actions";
import { Store } from "./store/store";

export class RestAPI {
    private authPrefix = "/auth/";
    private apiPrefix = "/api/";

    private test: boolean = false;
    private store: Store;

    constructor(store: ReturnType<typeof useStore>) {
        this.store = store as any; // TODO: Fix types
        console.log("Construct API");
        console.log(this.store);
    }

    public async signup(email: string, pw: string, lang: string) {
        const result = await this.apiCall("account/signup", JSON.stringify({user: email, pw, lang}));
        if (result.status !== 200) {return false; }
        const body = await result.json();
        this.store.dispatch({type: ActionTypes.SIGNUP, payload: body});
        return;
    }

    public verify(verificationCode: string) {
        const state = this.store.getState();
        const accountId = state.account.accountId;
        if (accountId === null) { throw new Error("Unknown AccountID"); }
        return this.apiCall("account/verify/email", JSON.stringify({accountId, verificationCode}));
    }

    public forgotPassword(email: string, lang: string) {
        return this.apiCall( "account/forgotpassword", JSON.stringify({user: email, lang}));
    }

    public async login(email: string, password: string) {
        try {
            const deviceId = await this.deviceId();
            const deviceName = "Webpage";
            const response = await this.authCall(
                "login",
                JSON.stringify({
                    deviceId,
                    deviceName,
                    pw: password,
                    user: email,
                }),
            );
            if (response.status !== 200) {
                return false;
            }
            const body = await response.json();
            this.store.dispatch({type: ActionTypes.LOGIN, payload: body});
            // if (typeof this.state.accessTokenExpire === "number" &&
            //     typeof this.state.refreshToken === "string") {
            //         // Try to refresh the token 5 minutes before expiry
            //         // But keep delay within range as the local clock may differ with the server's clock
            //         const longestDelay = 28 * 60 * 1000;
            //         const shortestDelay = 1 * 60 * 1000;
            //         let delay = (this.state.accessTokenExpire - Date.now()) - 5 * 60 * 1000;
            //         if (delay > longestDelay) {delay = longestDelay; }
            //         if (delay < shortestDelay) {delay = shortestDelay; }
            //         if (this.refreshSessionTimeout) {clearTimeout(this.refreshSessionTimeout); }
            //         this.refreshSessionTimeout = setTimeout(() => this.autoRefreshSesion(), delay);
            // } else {
            //     console.log("Could not schedule automatic session refresh");
            // }
            return true;
        } catch (e) {
            return false;
        }
    }
    public async refreshSession() {
        const state = this.store.getState();
        const deviceId = await this.deviceId();
        if (typeof state.account.sessionId !== "string") {
            throw new Error("Could not refresh session - session not started");
        }
        if (typeof state.account.refreshToken !== "string") {
            throw new Error("Could not refresh session - no refresh token");
        }
        if (typeof state.account.accountId !== "string") {
            throw new Error("Could not refresh session - 'accountId' is missing");
        }
        if (typeof deviceId !== "string") {
            throw new Error("Could not refresh session - 'deviceId' is missing");
        }
        if (typeof state.account.refreshTokenExpire === "number" && state.account.refreshTokenExpire < Date.now()) {
            console.log("It seems that the refresh token has expired, attempting to refresh session regardless.");
        }
        const response = await this.authCall("token", JSON.stringify({
            accountId: state.account.accountId,
            deviceId,
            refreshToken: state.account.refreshToken,
            sessionId: state.account.sessionId,
        }), false);
        if (response.status !== 200) {
            return false;
        }
        const body = await response.json();
        this.store.dispatch({type: ActionTypes.REFRESH_SESSION, payload: body});
        return true;
    }
    public endSession(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    public getPaymentToken(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    public reportPaymentNonce(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private async autoRefreshSesion() {
        try {
            await this.refreshSession();
            // TODO: implement retry
        } catch (e) {
            console.log("failed to autorefresh session");
        }
    }

    private authCall(route: string, body: string, refresh = true) {
        return this.call(this.authPrefix, route, body, refresh);
    }
    private apiCall(route: string, body: string, refresh = true) {
        return this.call(this.apiPrefix, route, body, refresh);
    }

    private async call(prefix: string, route: string, body: string, refresh: boolean) {
        try {
            const response = await this.fetchRoute(prefix, route, body);
            return response;
        } catch (e) {
            if (refresh &&
                e instanceof RestAPIError &&
                e.getErrorMessageType() === RestAPIErrorType.EXPIRED_ACCESS_TOKEN) {
                await this.refreshSession();
                return this.fetchRoute(prefix, route, body);
            }
            throw e;
        }
    }

    private async fetchRoute(prefix: string, route: string, body: string) {
        if (this.test) {
            const maxDelay = 10000;
            const delaySkew = 5;
            const failureRate = 0.01;
            const delay = Math.pow(Math.random(), delaySkew) * maxDelay;
            console.log(`Delaying request to '${route}' by ${Math.round(delay).toLocaleString()}ms`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            if (Math.random() <= failureRate) {
                console.log(`Blocking rest request to '${route}' to simulate error`);
                throw new RestAPIError(RestAPIErrorType.MOCK);
            }
        }
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        const state = this.store.getState();
        if (typeof state.account.accessToken !== "string") {
            headers.append("X-Access-Token", state.account.accessToken);
            if (typeof state.account.accessTokenExpire === "number" && state.account.accessTokenExpire < Date.now()) {
                console.log("It seems like the access token has expired, attempting request regardless");
            }
        }
        const url = prefix + route;
        const response = await fetch(url, {
            body,
            headers,
            method: "POST",
        });

        if (response.status === 200) {return response; }

        const responseBody = await response.json();
        if (typeof responseBody.errCode === "number") {
            throw new RestAPIError(responseBody.errCode);
        } else  {
            throw new RestAPIError(RestAPIErrorType.UNKNOWN);
        }

    }

    private async deviceId() {
        const state = this.store.getState();
        if (state.account.deviceId !== null) {
            return state.account.deviceId;
        }
        return new Promise<string>(async (resolve) => {
            let deviceId = "";
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < 64; i++ ) {
                deviceId += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            this.store.dispatch({type: ActionTypes.DEVICE_ID, payload: deviceId});
            resolve(deviceId);
        });
    }
}

export function useRestAPI() {
    const store = useStore();
    return new RestAPI(store);
}
