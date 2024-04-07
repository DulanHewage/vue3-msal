import { InteractionStatus, PublicClientApplication, InteractionType } from '@azure/msal-browser';
import type { AccountInfo, AuthenticationResult, AuthError, PopupRequest, RedirectRequest, SilentRequest } from '@azure/msal-browser';
import type { Ref } from 'vue';
import { msalInstance } from './MsalConfig';
import { msalPlugin } from './Vue3MsalPlugin';
export type MsalContext = {
    instance: PublicClientApplication;
    accounts: Ref<AccountInfo[]>;
    inProgress: Ref<InteractionStatus>;
    loginRequest: {
        scopes: string[];
    };
    callMsGraph: (accessToken: string) => Promise<any>;
};
export declare function useMsal(): MsalContext;
export declare function useIsAuthenticated(): Ref<boolean>;
export type MsalAuthenticationResult = {
    acquireToken: (requestOverride?: PopupRequest | RedirectRequest | SilentRequest) => Promise<void>;
    result: Ref<AuthenticationResult | null>;
    error: Ref<AuthError | null>;
    inProgress: Ref<boolean>;
};
export declare function useMsalAuthentication(interactionType: InteractionType, request: PopupRequest | RedirectRequest | SilentRequest): MsalAuthenticationResult;
export { msalInstance };
export { msalPlugin };
