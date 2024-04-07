import { PublicClientApplication } from '@azure/msal-browser';
import type { Configuration } from '@azure/msal-browser';

export const msalInstance = (msalConfig: Configuration) => {
  return new PublicClientApplication(msalConfig);
};
