import { InteractionStatus, PublicClientApplication } from '@azure/msal-browser';
import type { AccountInfo } from '@azure/msal-browser';
export type AccountIdentifiers = Partial<Pick<AccountInfo, 'homeAccountId' | 'localAccountId' | 'username'>>;
export type State = {
    instance: PublicClientApplication;
    inProgress: InteractionStatus;
    accounts: AccountInfo[];
};
export * from './index.ts';
