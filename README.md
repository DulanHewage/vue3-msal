# Microsoft Authentication Library for Vue 3

Vue 3 plugin for integrating MSAL.js into your app, offering easy-to-use composables.

## Installation

To install the package, use the following npm command:

```sh
npm i vue3-msal-plugin
```

## Configuration

In your main.ts file, you need to initialize the plugin with your MSAL instance.

```typescript
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

import { msalPlugin, msalInstance } from 'vue3-msal-plugin';
import type { Configuration, AuthenticationResult } from '@azure/msal-browser';
import { EventType } from '@azure/msal-browser';

const app = createApp(App);

// Define the configuration for the MSAL instance
// For more detailed usage and other available options, please refer to the official MSAL.js documentation - https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md

const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID,
    authority: import.meta.env.VITE_AUTHORITY,
    redirectUri: 'http://localhost:5173', // Must be registered as a SPA redirectURI on your app registration
    postLogoutRedirectUri: 'http://localhost:5173', // Must be registered as a SPA redirectURI on your app registration
  },
  cache: {
    cacheLocation: 'localStorage',
  },
};

// Create a new MSAL instance with the defined configuration
const newMsalInstance = msalInstance(msalConfig);

// Get all accounts from the MSAL instance
const accounts = newMsalInstance.getAllAccounts();
if (accounts.length > 0) {
  // If there are any accounts, set the first one as the active account
  newMsalInstance.setActiveAccount(accounts[0]);
}

// Add an event callback to the MSAL instance
newMsalInstance.addEventCallback((event) => {
  // If the event is a successful login and the event has a payload
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    // Cast the payload to an AuthenticationResult
    const payload = event.payload as AuthenticationResult;
    // Get the account from the payload
    const account = payload.account;
    // Set the account as the active account in the MSAL instance
    newMsalInstance.setActiveAccount(account);

    /* Optioanlly, You can update the user store with the account data here.
    'account' refers to the account data obtained from the MSAL instance.
    updateUser(account)
    */
  }
});

app.use(router);

// Use the vue3-msal-plugin with the MSAL instance
app.use(msalPlugin, newMsalInstance);

// Handle page refresh
// Get the active account from the MSAL instance
const activeAccount = newMsalInstance.getActiveAccount();
if (activeAccount) {
  /* Optioanlly, you can update the user store with the account data here.
    'account' refers to the account data obtained from the MSAL instance.
    updateUser(activeAccount)
    */
}

app.mount('#app');
```

## Composables

The plugin provides a `useMsal` composable that you can use in your components to access the MSAL instance and its related properties and methods. Here's an example:

```typescript
import { useMsal } from 'vue3-msal-plugin';

const { instance, accounts, inProgress } = useMsal();

console.log('instance', instance); // MSAL instance
console.log('accounts', accounts.value); // Array of account objects
console.log('inProgress', inProgress.value); // Authentication status
```

The `instance` is the MSAL instance, `accounts` is an array of account objects, and `inProgress` is a reactive property that indicates the authentication status.

The `useMsal` function also initializes the MSAL instance and handles redirect promises if the interaction status is `InteractionStatus.Startup`.

For login operations, a `loginRequest` object is used. It contains a `scopes` property which is an array of permission scopes. All parameters in the login requests are optional, so you can just send an empty object.

Read more about scopes [here.](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#scopes)

You can use these methods to perform various authentication operations:

```typescript
const { instance, accounts, inProgress, loginRequest } = useMsal();

const loginPopup = () => {
  instance.loginPopup(loginRequest);
};

const loginRedirect = () => {
  instance.loginRedirect(loginRequest);
};

const logoutPopup = () => {
  instance.logoutPopup({
    mainWindowRedirectUri: '/',
  });
};

const logoutRedirect = () => {
  instance.logoutRedirect();
};
```

### useIsAuthenticated

The `useIsAuthenticated` composable provides a reactive property that indicates whether the user is authenticated or not.

```typescript
import { useIsAuthenticated } from 'vue3-msal-plugin';

const isAuthenticated = useIsAuthenticated(); // Reactive property
```

You can use this property to conditionally render components or perform actions based on the authentication status of the user.

### useMsalAuthentication

The `useMsalAuthentication` composable from vue3-msal-plugin provides a way to handle authentication and acquire tokens using MSAL.

```typescript
import { useMsalAuthentication, InteractionType } from 'vue3-msal-plugin';

const { acquireToken, result, error, inProgress } = useMsalAuthentication(interactionType, request);
```

**`useMsalAuthentication` takes two parameters:**

- `interactionType`: This is of type InteractionType and it specifies the type of interaction to be used for authentication. It can be Popup, Redirect, or Silent.

- `request`: This is an object of type PopupRequest, RedirectRequest, or SilentRequest. It contains the parameters for the authentication request.

**`useMsalAuthentication` returns an object with the following properties:**

- `acquireToken`: This is a function that can be used to manually initiate the token acquisition process. It takes an optional requestOverride parameter which can be used to override the initial request parameters.

- `result`: This is a reactive property that holds the result of the authentication process. It will be null if the process has not completed or if an error occurred.

- `error`: This is a reactive property that holds any error that occurred during the authentication process. It will be null if no error occurred.

- `inProgress`: This is a reactive property that indicates whether the authentication process is currently in progress.

The `useMsalAuthentication` function automatically initiates the token acquisition process when it is called. If the process is not completed and no error occurred, it will be re-initiated whenever the global inProgress status changes.

Please note that `useMsalAuthentication` should only be called within the setup() function of a Vue component. Also, the MSAL plugin must be installed in your application. If these conditions are not met, useMsalAuthentication will throw an error.

### callMsGraph

#### Makes a GET request to the Microsoft Graph API

The `callMsGraph` function takes an access token as a parameter and returns a promise that resolves with the response data from the Microsoft Graph API.

You can see an example of how to use this function in here [MyProfile.vue](/samples/sample-with-pinia/src/components/MyProfile.vue).

```typescript
import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import { useMsal } from 'vue3-msal-plugin';
import type { AccountInfo } from '@azure/msal-browser';

const { callMsGraph } = useMsal();
type UserInfo = AccountInfo | null;

const msGraphData: Ref<UserInfo> = ref(null);

async function fetchData() {
  try {
    const response = await callMsGraph('your-access-token-here');
    msGraphData.value = response;
  } catch (error) {
    console.error(error);
  }
}

fetchData();
```

To obtain the access token, you can use the `result` from `useMsalAuthentication` composable.

## Acknowledgments

- [Microsoft Authentication Library for JavaScript (MSAL.js)](https://github.com/AzureAD/microsoft-authentication-library-for-js)

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Dulan Hewage - dulanhewage2@hotmail.com
