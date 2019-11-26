import { useStore } from "react-redux";
import { RestAPIError, RestAPIErrorType } from "./restapi_errors";
import { ActionTypes } from "./store/actions";
import { Store } from "./store/store";
import { IdentityType } from "./utils/accountType";

function phoneOrEmail(str: string): { phoneNr?: string, email?: string } {
    if (str.indexOf("@") === -1) {
        return { phoneNr: str };
    } else {
        return { email: str };
    }
}

export class RestAPI {
    private paymentPrefix = "/payment/";
    private authPrefix = "/auth/";
    private apiPrefix = "/api/";

    private test: boolean = false;
    private store: Store;

    constructor(store: ReturnType<typeof useStore>) {
        this.store = store as any; // TODO: Fix types
    }

    public async signup(id: string, pw: string, lang: string) {
        const { phoneNr, email } = phoneOrEmail(id);
        const result = await this.apiCall("signup", JSON.stringify({
            email,
            lang,
            phoneNr,
            pw,
        }));
        if (result.status !== 200) { return false; }
        const body = await result.json();
        this.store.dispatch({ type: ActionTypes.SIGNUP, payload: body });
        return;
    }

    public verify(verificationCode: string, type: IdentityType) {
        const state = this.store.getState();
        const accountId = state.account.accountId;
        if (accountId === null) { throw new Error("Unknown AccountID"); }
        switch (type) {
            case IdentityType.Phone:
                return this.apiCall("verify/phonenumber", JSON.stringify({ accountId, verificationCode }));
            case IdentityType.Email:
                return this.apiCall("verify/email", JSON.stringify({ accountId, verificationCode }));
            default:
                throw new Error("Unknown Account Type");
        }
    }

    public forgotPassword(id: string, lang: string) {
        const { phoneNr, email } = phoneOrEmail(id);
        return this.apiCall("forgotpassword", JSON.stringify({
            email,
            lang,
            phoneNr,
        }));
    }

    public restorePassword(id: string, password: string, resetCode: string) {
        const { phoneNr, email } = phoneOrEmail(id);

        return this.apiCall("restorepassword", JSON.stringify({
            accountEmail: email,
            accountPhoneNr: phoneNr,
            pw: password,
            verificationCode: resetCode,
        }));
    }

    public changePassword(currentPassword: string, newPassword: string) {
        return this.apiCall("self/password", JSON.stringify({
            currPass: currentPassword,
            newPass: newPassword,
        }));
    }

    public async login(id: string, password: string) {
        try {
            const { phoneNr, email } = phoneOrEmail(id);
            const deviceId = await this.deviceId();
            const deviceName = "Webpage";
            const response = await this.authCall(
                "login",
                JSON.stringify({
                    deviceId,
                    deviceName,
                    email,
                    phoneNr,
                    pw: password,
                }),
            );
            if (response.status !== 200) {
                return false;
            }
            const body = await response.json();
            this.store.dispatch({ type: ActionTypes.LOGIN, payload: body });
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
            if (e instanceof RestAPIError) {
                switch (e.getErrorMessageType()) {
                    case RestAPIErrorType.EMAIL_NOT_VERIFIED:
                        const body = e.getBody();
                        this.store.dispatch({ type: ActionTypes.ACCOUNT_ID, payload: body });
                }
            }
            throw e;
        }
    }
    public async refreshSession() {
        // TODO: Create promise that other api calls can wait on for refresh
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
        this.store.dispatch({ type: ActionTypes.REFRESH_SESSION, payload: body });
        return true;
    }
    public async endSession(): Promise<undefined> {
        const state = this.store.getState();
        const deviceId = state.account.deviceId;
        try {
            const response = await this.authCall("signout", JSON.stringify({ deviceId }));
        } catch (e) {
            if (!(e instanceof RestAPIError)) { throw e; }
            switch (e.getErrorMessageType()) {
                case RestAPIErrorType.ITEM_NOT_FOUND:
                case RestAPIErrorType.DEVICE_NOT_FOUND:
                    break;
                default:
                    throw e;
            }
        } finally {
            // Destroy local session data even if server wouldn't
            this.store.dispatch({ type: ActionTypes.LOGOUT, payload: undefined });
        }
        return;
    }
    public async getTransactionHistory() {
        const response = await this.paymentCall("GET", "history");
        const body = await response.json();
        if (typeof body === "object") {
            const { clientToken } = body;
            if (typeof clientToken === "string") {
                return clientToken;
            }
        }
        throw new RestAPIError(RestAPIErrorType.UNKNOWN, body);
    }
    public async getPaymentToken() {
        const response = await this.paymentCall("GET", "braintree/token");
        const body = await response.json();
        if (typeof body === "object") {
            const { clientToken } = body;
            if (typeof clientToken === "string") {
                return clientToken;
            }
        }
        throw new RestAPIError(RestAPIErrorType.UNKNOWN, body);
    }
    public async reportPaymentNonce(productCode: string, nonce: string) {
        const response = await this.paymentCall("POST", "braintree/payment", JSON.stringify({ nonce, productCode }));
        const body = await response.json();
        if (typeof body === "object") {
            const { transactionId } = body;
            if (typeof transactionId === "string") {
                return transactionId;
            }
        }
        throw new RestAPIError(RestAPIErrorType.UNKNOWN, body);
    }

    private async autoRefreshSesion() {
        try {
            await this.refreshSession();
            // TODO: implement retry
        } catch (e) {
            console.log("failed to autorefresh session");
        }
    }

    private paymentCall(method: "POST" | "GET", route: string, body?: string, refresh = true) {
        return this.call(method, this.paymentPrefix, route, body, refresh);
    }

    private authCall(route: string, body: string, refresh = true) {
        return this.call("POST", this.authPrefix, route, body, refresh);
    }
    private apiCall(route: string, body: string, refresh = true) {
        return this.call("POST", this.apiPrefix, route, body, refresh);
    }

    private async call(method: string, prefix: string, route: string, body: string | undefined, refresh: boolean) {
        try {
            const response = await this.fetchRoute(method, prefix, route, body);
            return response;
        } catch (e) {
            if (e instanceof RestAPIError) {
                switch (e.getErrorMessageType()) {
                    case RestAPIErrorType.EXPIRED_ACCESS_TOKEN:
                        this.store.dispatch({ type: ActionTypes.EXPIRED_ACCESS_TOKEN });
                        if (refresh) {
                            await this.refreshSession();
                            return this.fetchRoute(method, prefix, route, body);
                        }
                    case RestAPIErrorType.EXPIRED_REFRESH_TOKEN:
                        this.store.dispatch({ type: ActionTypes.EXPIRED_REFRESH_TOKEN });
                }
            }
            throw e;
        }
    }

    private async fetchRoute(method: string, prefix: string, route: string, body?: string) {
        if (this.test) {
            const maxDelay = 10000;
            const delaySkew = 5;
            const failureRate = 0.01;
            const delay = Math.pow(Math.random(), delaySkew) * maxDelay;
            console.log(`Delaying request to '${route}' by ${Math.round(delay).toLocaleString()}ms`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            if (Math.random() <= failureRate) {
                console.log(`Blocking rest request to '${route}' to simulate error`);
                throw new RestAPIError(RestAPIErrorType.MOCK, {});
            }
        }
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        const state = this.store.getState();
        if (typeof state.account.accessToken === "string") {
            headers.append("X-Access-Token", state.account.accessToken);
            if (typeof state.account.accessTokenExpire === "number" && state.account.accessTokenExpire < Date.now()) {
                console.log("It seems like the access token has expired, attempting request regardless");
            }
        }
        const url = prefix + route;
        const response = await fetch(url, {
            body,
            headers,
            method,
        });

        if (response.status === 200) { return response; }

        const responseBody = await response.json();
        let errCode = RestAPIErrorType.UNKNOWN;
        let errParams;
        if (typeof responseBody.errCode === "number") {
            errCode = responseBody.errCode;
        }
        if (typeof responseBody.errParams === "object") {
            errParams = responseBody.errParams;
        }
        throw new RestAPIError(errCode, errParams);

    }

    private async deviceId() {
        const state = this.store.getState();
        if (state.account.deviceId !== null) {
            return state.account.deviceId;
        }
        return new Promise<string>(async (resolve) => {
            let deviceId = "";
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < 64; i++) {
                deviceId += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            this.store.dispatch({ type: ActionTypes.DEVICE_ID, payload: deviceId });
            resolve(deviceId);
        });
    }
}

export function useRestAPI() {
    const store = useStore();
    return new RestAPI(store);
}
