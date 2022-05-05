import {LoggingService} from "@/libs/logging/services/logging.service";
import {Field, InputType, Int, ObjectType} from "@nestjs/graphql";

export type Did = string;

export type EverscaleClientConfiguration = {
  everscaleSignerAddressesPath: string;
  defaultNetwork: string;
  networks: {
    mainnet: string[],
    testnet: string[]
  },
  contractsAddresses: {[key: string]: string}
}

export const EverscaleClient = 'EVERSCALE_CLIENT';

export interface IEverscaleClient {
  generateKeys(): Promise<{public: string, secret: string}>;
  verifySignature(input: {signed: string, message: string, publicKey: string}): Promise<boolean>;
  signMessage(input: {message: string, keys: {public: string, secret: string}}): Promise<{signed: string, signature: string}>;
  issuerVC(claims: ClaimsGroup[], issuerPubKey: string): Promise<Did>;
}

export interface IEverscaleClientsParamsInit {
  everscaleSignerAddresses: {[key: string]: {address?: string, keys?: { public: string, secret: string }}};
  defaultNetwork: string;
  networks: {
    mainnet: string[],
    testnet: string[]
  },
  contractsAddresses: {[key: string]: string}
}

export interface IEverscaleClientService {
  init: (params: IEverscaleClientsParamsInit, logger: LoggingService) => Promise<void>;
  generateKeys(): Promise<{public: string, secret: string}>;
  verifySignature(input: {signed: string, message: string, publicKey: string}): Promise<boolean>;
  signMessage(input: {message: string, keys: {public: string, secret: string}}): Promise<{signed: string, signature: string}>;
  issuerVC(claims: ClaimsGroup[], issuerPubKey: string): Promise<Did>;
}

@ObjectType()
@InputType()
export class ClaimsGroup {
  @Field(type => String)
  hmacHigh_claimGroup: string;

  @Field(type => String)
  hmacHigh_groupDid: string;

  @Field(type => String)
  signHighPart: string;

  @Field(type => String)
  signLowPart: string;
}
