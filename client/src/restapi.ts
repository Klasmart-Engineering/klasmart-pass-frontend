import { Store } from "redux";
export class RestAPI {
    private static singleton: RestAPI;
    private authPrefix = "/auth/";
    private apiPrefix = "/api/";

    private test: boolean = false;

    // tslint:disable-next-line:variable-name
    private _deviceId?: string;

    private sessionId?: string;
    private accountId?: string;
    private email?: string;
    private refreshToken?: string;
    private refreshTokenExpire?: number;
    private accessToken?: string;
    private accessTokenExpire?: number;

    constructor() {
        if (RestAPI.singleton) {return RestAPI.singleton; }
        RestAPI.singleton = this;
    }

    public signup(user: string, pw: string, lang: string) {
        return this.apiCall("account/signup", JSON.stringify({user, pw, lang}));
    }

    public verify(accountId: string, verificationCode: string) {
        return this.apiCall("account/verify/email", JSON.stringify({accountId, verificationCode}));
    }

    public forgotPassword(user: string, lang: string) {
        return this.apiCall("account/forgotpassword", JSON.stringify({user, lang}));
    }

    public async login(user: string, pw: string): Promise<boolean> {
        try {
            const deviceId = this.deviceId();
            const deviceName = "Webpage";
            const response = await this.authCall("login", JSON.stringify({user, pw, deviceId, deviceName}));
            if (response.status !== 200) {
                return false;
            }
            const body = await response.json();
            if (typeof body.sessionId === "string") {this.sessionId = body.sessionId; }
            if (typeof body.accountId === "string") {this.accountId = body.accountId; }
            if (typeof body.email === "string") {this.email = body.email; }
            if (typeof body.refreshToken === "string") {
                this.refreshToken = body.refreshToken;
                if (typeof body.refreshTokenExpire === "number") {this.refreshTokenExpire = body.refreshTokenExpire; }
            }
            if (typeof body.accessToken === "string") {
                this.accessToken = body.accessToken;
                if (typeof body.accessTokenExpire === "number") {this.accessTokenExpire = body.accessTokenExpire; }
            }
            if (this.accessTokenExpire !== undefined && this.refreshToken !== undefined) {
                const autoRefreshTime = this.accessTokenExpire - 5 * 60 * 1000;
                const delay = Math.max(0, Date.now());
                setTimeout(() => this.autoRefreshSesion(), delay);
            } else {
                console.log("Could not schedule auto-refresh");
            }
            return true;
        } catch (e) {
            return false;
        }
    }
    public refreshSession() {
        return this.authCall("token", JSON.stringify({
            accountId: this.accountId,
            deviceId: this.deviceId,
            refreshToken: this.refreshToken,
            sessionId: this.sessionId,
        }));
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
                throw new Error(`Blocking rest request to '${route}' to simulate error`);
            }
        }
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        if (this.accessToken !== undefined) {
            headers.append("X-Access-Token", this.accessToken);
        }
        const url = prefix + route;
        return fetch(url, {
            body,
            headers,
            method: "POST",
        });
    }

    private deviceId() {
        if (this._deviceId === undefined) {
            this._deviceId = "";
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < 64; i++ ) {
                this._deviceId += characters.charAt(Math.floor(Math.random() * characters.length));
            }
        }
        return this._deviceId;
    }
}

(window as any).restAPI = new RestAPI();
