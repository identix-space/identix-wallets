import { ConfigService } from "@nestjs/config";

import { existsSync, readFile } from "fs";
import { promisify } from "util";

import {
  SSOClient,
  ISSOClient,
  SSOClientConfiguration
} from "@/libs/sso-client/types";
import { LoggingService } from "@/libs/logging/services/logging.service";
import { SsoClientService } from "@/libs/sso-client/services/sso-client.service";
import { SsoService } from "identix-sso-client-js";
import { Did } from "../types";

const readFileAsync = promisify(readFile);

export const SSOClientProvider = {
  provide: SSOClient,
  useFactory: (
    config: ConfigService,
    logger: LoggingService,
    ssoClientService: SsoClientService
  ): Promise<ISSOClient> => ssoClientFactory(config, logger, ssoClientService),
  inject: [ConfigService, LoggingService, SsoClientService]
};

async function ssoClientFactory(
  config: ConfigService,
  logger: LoggingService,
  ssoClientService: SsoClientService
): Promise<ISSOClient> {
  const ssoClientConfig = config.get<SSOClientConfiguration>(
    "sso-client-configuration"
  );
  if (
    !ssoClientConfig ||
    !ssoClientConfig.pathToClientDid ||
    !ssoClientConfig.ssoGraphqlApiUrl
  ) {
    throw new Error(`SSO Client configuration is invalid!`);
  }

  ssoClientService.init(new SsoService(ssoClientConfig.ssoGraphqlApiUrl));

  const fullClientDifPath = `${process.cwd()}/${
    ssoClientConfig.pathToClientDid
  }`;
  if (!existsSync(fullClientDifPath)) {
    throw new Error(
      `SSO Client configuration is invalid: client Did path is incorrect!`
    );
  }

  let clientDid = null;
  try {
    const clientDidJson = await readFileAsync(fullClientDifPath);
    clientDid = JSON.parse(clientDidJson.toString());
  } catch (e) {
    throw new Error(`SSO Client Did is invalid: ${e.message}`);
  }

  let clientSessionDid = null;
  try {
    clientSessionDid = await ssoClientService.registerSession(clientDid);
  } catch (e) {
    throw new Error(
      `SSO Client Did is invalid. Impossible to get Session Did: ${e.message}`
    );
  }

  return {
    validateUserSession: async (userSessionDid: Did): Promise<Did> => {
      return ssoClientService.validateUserSession(
        clientSessionDid,
        userSessionDid
      );
    }
  };
}
