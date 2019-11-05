import Cookie from "js-cookie";
import { RestAPIError, RestAPIErrorType } from "./restapi_errors";
// TODO: Change optional state items to nullables
interface State {
    accessToken?: any; // string;
    accessTokenExpire?: any; // number;
    accountId?: any; // string;
    deviceId?: any; // string;
    email?: any; // string;
    refreshToken?: any; // string;
    refreshTokenExpire?: any; // number;
    sessionId?: any; // string;
}

export class RestAPI {
    public static getSingleton() {
        if (RestAPI.singleton === undefined) {
            RestAPI.singleton = new RestAPI();
        }
        return RestAPI.singleton;
    }
    private static singleton?: RestAPI;
    private authPrefix = "/auth/";
    private apiPrefix = "/api/";

    private test: boolean = false;

    private state: State;
    private refreshSessionTimeout: NodeJS.Timeout;

    private constructor() {
        this.state = Cookie.getJSON("rest");
        if (typeof this.state !== "object") {
            this.saveState({});
        }
    }

    public async signup(email: string, pw: string, lang: string) {
        const result = await this.apiCall("account/signup", JSON.stringify({user: email, pw, lang}));
        if (result.status !== 200) {return false; }
        const body = await result.json();
        this.saveState(body);
        return;
    }

    public verify(verificationCode: string) {
        const accountId = this.state.accountId;
        if (accountId === undefined) { throw new Error("Unknown AccountID"); }
        return this.apiCall("account/verify/email", JSON.stringify({accountId, verificationCode}));
    }

    public forgotPassword(email: string, lang: string) {
        return this.apiCall("account/forgotpassword", JSON.stringify({user: email, lang}));
    }

    public async login(email: string, password: string) {
        try {
            const deviceId = this.deviceId();
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
            this.saveState(body);

            if (typeof this.state.accessTokenExpire === "number" &&
                typeof this.state.refreshToken === "string") {
                    // Try to refresh the token 5 minutes before expiry
                    // But keep delay within range as the local clock may differ with the server's clock
                    const longestDelay = 28 * 60 * 1000;
                    const shortestDelay = 1 * 60 * 1000;
                    let delay = (this.state.accessTokenExpire - Date.now()) - 5 * 60 * 1000;
                    if (delay > longestDelay) {delay = longestDelay; }
                    if (delay < shortestDelay) {delay = shortestDelay; }
                    if (this.refreshSessionTimeout) {clearTimeout(this.refreshSessionTimeout); }
                    this.refreshSessionTimeout = setTimeout(() => this.autoRefreshSesion(), delay);
            } else {
                console.log("Could not schedule automatic session refresh");
            }
            return true;
        } catch (e) {
            return false;
        }
    }
    public async refreshSession() {
        if (typeof this.state.sessionId !== "string") {
            throw new Error("Could not refresh session - session not started");
        }
        if (typeof this.state.refreshToken !== "string") {
            throw new Error("Could not refresh session - no refresh token");
        }
        if (typeof this.state.accountId !== "string") {
            throw new Error("Could not refresh session - 'accountId' is missing");
        }
        if (typeof this.state.deviceId !== "string") {
            throw new Error("Could not refresh session - 'deviceId' is missing");
        }
        if (typeof this.state.refreshTokenExpire === "number" && this.state.refreshTokenExpire < Date.now()) {
            console.log("It seems that the refresh token has expired, attempting to refresh session regardless.");
        }
        const response = await this.authCall("token", JSON.stringify({
            accountId: this.state.accountId,
            deviceId: this.state.deviceId,
            refreshToken: this.state.refreshToken,
            sessionId: this.state.sessionId,
        }));
        if (response.status !== 200) {
            return false;
        }
        const newState = await response.json();
        this.saveState(newState);
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

    private authCall(route: string, body: string) {
        return this.call(this.authPrefix, route, body);
    }
    private apiCall(route: string, body: string) {
        return this.call(this.apiPrefix, route, body);
    }

    private async call(prefix: string, route: string, body: string) {
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
        if (typeof this.state.accessToken !== "string") {
            headers.append("X-Access-Token", this.state.accessToken);
            if (typeof this.state.accessTokenExpire === "number" && this.state.accessTokenExpire < Date.now()) {
                console.log("It seems like the access token has expired, attempting request regardless");
            }
        }
        const url = prefix + route;
        const response = await fetch(url, {
            body,
            headers,
            method: "POST",
        });
        if (response.status !== 200) {
            const responseBody = await response.json();
            if (typeof responseBody.errCode === "number") {
                throw new RestAPIError(responseBody.errCode);
            }
            throw new Error("Unknown RestAPI Error");
        }
        return response;
    }

    private deviceId() {
        if (this.state.deviceId === undefined) {
            this.state.deviceId = "";
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < 64; i++ ) {
                this.state.deviceId += characters.charAt(Math.floor(Math.random() * characters.length));
            }
        }
        return this.state.deviceId;
    }

    private saveState(stateUpdate: Partial<State>) {
        const newState = {...this.state, ...stateUpdate};
        Cookie.set("rest", newState);
        this.state = newState;
    }
}
