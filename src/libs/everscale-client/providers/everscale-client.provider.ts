import { ConfigService } from '@nestjs/config';
import { EverscaleClient, IEverscaleClient, EverscaleClientConfiguration } from "@/libs/everscale-client/types";
import { EverscaleClientService } from "@/libs/everscale-client/services/everscale-client.service";
import {LoggingService} from "@/libs//logging/services/logging.service";
import * as idxVcFabricContract from "../constants/idx-vc-fabric-contract.constants";

import {existsSync, readFile} from 'fs';
import {promisify} from 'util';
const readFileAsync = promisify(readFile);

export const EverscaleClientProvider = {
  provide: EverscaleClient,
  useFactory: async (
    config: ConfigService,
    logger: LoggingService,
    everscaleClient: EverscaleClientService
  ): Promise<IEverscaleClient> => await everscaleClientFactory(config, logger, everscaleClient),
  inject: [ConfigService, LoggingService, EverscaleClientService],
};

async function everscaleClientFactory(
  config: ConfigService,
  logger: LoggingService,
  everscaleClient: EverscaleClientService
): Promise<IEverscaleClient> {
  const everscaleClientConfig = config.get<EverscaleClientConfiguration>('everscale-client-configuration');
  if (!everscaleClientConfig || !everscaleClientConfig.everscaleAdminAddressesKeysPath) {
    throw new Error(`Everscale client configuration is invalid!`);
  }

  const fullEverscaleClientAddressesKeysPath = `${process.cwd()}/${everscaleClientConfig.everscaleAdminAddressesKeysPath}`;
  if (!existsSync(fullEverscaleClientAddressesKeysPath)) {
    throw new Error(`Everscale client configuration is invalid: admin addresses keys path is incorrect!`);
  }

  let everscaleAdminAddressesKeys = null;
  try {
    const everscaleClientAddressKeysJson = await readFileAsync(fullEverscaleClientAddressesKeysPath);
    everscaleAdminAddressesKeys = JSON.parse(everscaleClientAddressKeysJson.toString());
  } catch (e) {
    throw new Error(`Admin addresses keys file is invalid: ${e.message}`);
  }

  everscaleClient.init(
    {
      everscaleAdminAddressesKeys,
      ...idxVcFabricContract,
      defaultNetwork: everscaleClientConfig.defaultNetwork,
      networks: everscaleClientConfig.networks
    },
    logger
  );

  return {
    generateKeys: async (): Promise<{public: string, secret: string}> => {
      return everscaleClient.generateKeys();
    },
    verifyMessage: async (input: {signatureHex: string, message: string, publicKey: string}): Promise<boolean> => {
      return everscaleClient.verifyMessage(input);
    },
    signMessage: async (input: {message: string, privateKey: string}): Promise<string> => {
      return everscaleClient.signMessage(input);
    }
  };
}
