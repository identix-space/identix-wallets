import { ConfigService } from '@nestjs/config';
import { EverscaleClient, IEverscaleClient, EverscaleClientConfiguration } from "@/libs/everscale-client/types";
import { EverscaleClientService } from "@/libs/everscale-client/services/everscale-client.service";
import {LoggingService} from "@/libs//logging/services/logging.service";

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
  if (!everscaleClientConfig || !everscaleClientConfig.everscaleSignerAddressesPath) {
    throw new Error(`Everscale client configuration is invalid!`);
  }

  const fullEverscaleClientAddressesPath = `${process.cwd()}/${everscaleClientConfig.everscaleSignerAddressesPath}`;
  if (!existsSync(fullEverscaleClientAddressesPath)) {
    throw new Error(`Everscale client configuration is invalid: admin addresses path is incorrect!`);
  }

  let everscaleSignerAddresses = null;
  try {
    const everscaleClientAddressJson = await readFileAsync(fullEverscaleClientAddressesPath);
    everscaleSignerAddresses = JSON.parse(everscaleClientAddressJson.toString());
  } catch (e) {
    throw new Error(`Admin addresses keys file is invalid: ${e.message}`);
  }

  await everscaleClient.init(
    {
      everscaleSignerAddresses,
      defaultNetwork: everscaleClientConfig.defaultNetwork,
      contractsAddresses: everscaleClientConfig.contractsAddresses,
      networks: everscaleClientConfig.networks
    },
    logger
  );

  return {
    generateKeys: async (): Promise<{public: string, secret: string}> => {
      return everscaleClient.generateKeys();
    },
    verifySignature: async (input: {signed: string, message: string, publicKey: string}): Promise<boolean> => {
      return everscaleClient.verifySignature(input);
    },
    signMessage: async (input: {message: string, keys: {public: string, secret: string}}): Promise<{signed: string, signature: string}> => {
      return everscaleClient.signMessage(input);
    }
  };
}
