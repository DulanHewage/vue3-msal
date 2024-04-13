import { PublicClientApplication } from '@azure/msal-browser';
import type { Configuration } from '@azure/msal-browser';
/**
 * Creates and returns a new PublicClientApplication instance with the provided configuration.
 *
 * @param msalConfig - The configuration for the MSAL PublicClientApplication.
 * @returns A new PublicClientApplication instance.
 */
export declare const msalInstance: (msalConfig: Configuration) => PublicClientApplication;
