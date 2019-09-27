import { Store } from "redux";

export class RestAPI {
    private static singleton: RestAPI;

    private urlPrefix = "";
    private loginMutex?: Promise<boolean>;

    constructor() {
        if (RestAPI.singleton) {return RestAPI.singleton; }

        RestAPI.singleton = this;
    }
    public login(): Promise<boolean> {
        if (this.loginMutex) {return this.loginMutex; }
        this.loginMutex = new Promise((resolve, reject) => {
            reject(new Error("Method not implemented."));
        });
        this.loginMutex.finally(() => this.loginMutex = undefined);

    }
    public refreshSession(): Promise<boolean> {
        throw new Error("Method not implemented.");
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
}
