import { registerAs } from "@nestjs/config";

import { SSOClientConfiguration } from "../types";

export default registerAs(
  "sso-client-configuration",
  (): SSOClientConfiguration => ({
    pathToClientDid: process.env.PATH_TO_CLIENT_DID,
    ssoGraphqlApiUrl: process.env.SSO_GRAPHQL_API_URL
  })
);
