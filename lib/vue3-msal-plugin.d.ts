import type { App } from 'vue';
import { PublicClientApplication } from '@azure/msal-browser';
export declare const msalPlugin: {
    install: (app: App, msalInstance: PublicClientApplication) => void;
};
