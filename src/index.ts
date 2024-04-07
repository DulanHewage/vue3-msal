import { InteractionStatus, PublicClientApplication, InteractionType } from '@azure/msal-browser';
import type {
  AccountInfo,
  AuthenticationResult,
  AuthError,
  PopupRequest,
  RedirectRequest,
  SilentRequest,
} from '@azure/msal-browser';
import { getCurrentInstance, toRefs, watch, ref } from 'vue';
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
const loginRequest = {
  scopes: ['User.Read'],
};

export function useMsal(): MsalContext {
  const internalInstance = getCurrentInstance();
  if (!internalInstance) {
    throw 'useMsal() cannot be called outside the setup() function of a component';
  }
  const { instance, accounts, inProgress } = toRefs(internalInstance.appContext.config.globalProperties.$msal);

  if (!instance.value || !accounts.value || !inProgress.value) {
    throw 'Please install the msalPlugin';
  }

  if (inProgress.value === InteractionStatus.Startup) {
    instance.value.initialize().then(() => {
      instance.value.handleRedirectPromise().catch(() => {
        // Errors should be handled by listening to the LOGIN_FAILURE event
        return;
      });
    });
  }

  return {
    instance: instance.value,
    accounts,
    inProgress,
    loginRequest,
    callMsGraph,
  };
}

export function useIsAuthenticated(): Ref<boolean> {
  const { accounts } = useMsal();
  const isAuthenticated = ref(accounts.value.length > 0);

  watch(accounts, () => {
    isAuthenticated.value = accounts.value.length > 0;
  });

  return isAuthenticated;
}

export type MsalAuthenticationResult = {
  acquireToken: (requestOverride?: PopupRequest | RedirectRequest | SilentRequest) => Promise<void>;
  result: Ref<AuthenticationResult | null>;
  error: Ref<AuthError | null>;
  inProgress: Ref<boolean>;
};

export function useMsalAuthentication(
  interactionType: InteractionType,
  request: PopupRequest | RedirectRequest | SilentRequest,
): MsalAuthenticationResult {
  const { instance, inProgress } = useMsal();

  const localInProgress = ref<boolean>(false);
  const result = ref<AuthenticationResult | null>(null);
  const error = ref<AuthError | null>(null);

  const acquireToken = async (requestOverride?: PopupRequest | RedirectRequest | SilentRequest) => {
    if (!localInProgress.value) {
      localInProgress.value = true;
      const tokenRequest = requestOverride || request;

      if (inProgress.value === InteractionStatus.Startup || inProgress.value === InteractionStatus.HandleRedirect) {
        try {
          const response = await instance.handleRedirectPromise();
          if (response) {
            result.value = response;
            error.value = null;
            return;
          }
        } catch (e) {
          result.value = null;
          error.value = e as AuthError;
          return;
        }
      }

      try {
        const response = await instance.acquireTokenSilent(tokenRequest);
        result.value = response;
        error.value = null;
      } catch (e) {
        if (inProgress.value !== InteractionStatus.None) {
          return;
        }

        if (interactionType === InteractionType.Popup) {
          instance
            .loginPopup(tokenRequest)
            .then((response) => {
              result.value = response;
              error.value = null;
            })
            .catch((e) => {
              error.value = e;
              result.value = null;
            });
        } else if (interactionType === InteractionType.Redirect) {
          await instance.loginRedirect(tokenRequest).catch((e) => {
            error.value = e;
            result.value = null;
          });
        }
      }
      localInProgress.value = false;
    }
  };

  const stopWatcher = watch(inProgress, () => {
    if (!result.value && !error.value) {
      acquireToken();
    } else {
      stopWatcher();
    }
  });

  acquireToken();

  return {
    acquireToken,
    result,
    error,
    inProgress: localInProgress,
  };
}

const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};
async function callMsGraph(accessToken: string) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers,
  };

  return fetch(graphConfig.graphMeEndpoint, options)
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

export { msalInstance };

export { msalPlugin };
