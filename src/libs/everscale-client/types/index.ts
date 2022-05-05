import {LoggingService} from "@/libs/logging/services/logging.service";

export type EverscaleClientConfiguration = {
  everscaleAdminAddressesKeysPath: string;
  defaultNetwork: string;
  networks: {
    mainnet: string[],
    testnet: string[]
  }
}

export const EverscaleClient = 'EVERSCALE_CLIENT';

export interface IEverscaleClient {
  generateKeys(): Promise<{public: string, secret: string}>;
  verifySignature(input: {signed: string, message: string, publicKey: string}): Promise<boolean>;
  signMessage(input: {message: string, keys: {public: string, secret: string}}): Promise<{signed: string, signature: string}>;
}

export interface IEverscaleClientsParamsInit {
  everscaleAdminAddressesKeys: {[key: string]: { public: string, secret: string }};
  idxVcFabricContractAbiBase64: string;
  idxVcFabricContractTvcBase64: string;
  defaultNetwork: string;
  networks: {
    mainnet: string[],
    testnet: string[]
  }
}

export interface IEverscaleClientService {
  init: (params: IEverscaleClientsParamsInit, logger: LoggingService) => void;
  generateKeys(): Promise<{public: string, secret: string}>;
  verifySignature(input: {signed: string, message: string, publicKey: string}): Promise<boolean>;
  signMessage(input: {message: string, keys: {public: string, secret: string}}): Promise<{signed: string, signature: string}>;
}

