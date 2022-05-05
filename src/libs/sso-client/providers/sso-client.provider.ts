import {ConfigService} from '@nestjs/config';
import {SSOClient, ISSOClient, SSOClientConfiguration} from "@/libs/sso-client/types";
import {LoggingService} from "@/libs/logging/services/logging.service";
import {Did} from "@/libs/everscale-client/types";
import {SsoService} from "identix-sso-client-js";
import {SsoClientService} from "../services/sso-client.service";

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
    !ssoClientConfig.ssoClientToken ||
    !ssoClientConfig.ssoGraphqlApiUrl
  ) {
    throw new Error(`SSO Client configuration is invalid!`);
  }

  ssoClientService.init(new SsoService(ssoClientConfig.ssoGraphqlApiUrl));

  return {
    validateUserSession: async (userSessionDid: Did): Promise<Did> => {
      return ssoClientService.validateUserSession(
        ssoClientConfig.ssoClientToken,
        userSessionDid
      );
    }
  };
}
