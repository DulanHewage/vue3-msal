import { InteractionType } from '@azure/msal-browser';
import type { PopupRequest, RedirectRequest, SilentRequest } from '@azure/msal-browser';
import type { Ref } from 'vue';
import type { MsalContext, MsalAuthenticationResult } from './types';
import { msalInstance } from './msal-config';
import { msalPlugin } from './vue3-msal-plugin';
/**
 * Provides access to the MSAL instance, user accounts, and interaction status.
 * @throws {string} If called outside the setup() function of a component or if the MSAL plugin is not installed.
 * @returns {MsalContext} The MSAL context.
 */
export declare function useMsal(): MsalContext;
/**
 * Returns a reactive reference to a boolean indicating whether the user is authenticated.
 * @returns {Ref<boolean>} A reference to a boolean indicating whether the user is authenticated.
 */
export declare function useIsAuthenticated(): Ref<boolean>;
/**
 * Returns an object with methods for acquiring a token and reactive references to the authentication result, any error, and whether an authentication process is in progress.
 * @param {InteractionType} interactionType The type of interaction to use for authentication.
 * @param {PopupRequest | RedirectRequest | SilentRequest} request The request object for authentication.
 * @returns {MsalAuthenticationResult} The result of the authentication process.
 */
export declare function useMsalAuthentication(interactionType: InteractionType, request: PopupRequest | RedirectRequest | SilentRequest): MsalAuthenticationResult;
export { msalInstance };
export { msalPlugin };
