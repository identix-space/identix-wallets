import {Did} from "@/libs/everscale-client/types";

export const SSOClient = 'SSO_CLIENT_PROVIDER';

export interface ISSOClient {
  validateUserSession(userSessionDid: Did): Promise<Did>; // returns client Did or throw exception
}

export interface ISSOClientService {
  validateUserSession(clientSessionDid: Did, userSessionDid: Did): Promise<Did>; // returns client Did or throw exception
}

export type SSOClientConfiguration = {
  ssoClientToken: string;
  ssoGraphqlApiUrl: string;
};

export interface ISsoNpmService {
  requestClientLogin: (clientDid: Did) => Promise<Did>;
  attemptClientLogin: (clientDid: Did, signedOtcDid: Did) => Promise<Did>;
  validateUserSession: (ssoClientToken: string, userSessionDid: Did) => Promise<Did>;
}
