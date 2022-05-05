import { Injectable } from "@nestjs/common";
import {IEverscaleClientService, IEverscaleClientsParamsInit} from "@/libs/everscale-client/types";

import {Account} from '@tonclient/appkit';
import {libNode} from '@tonclient/lib-node';
import {signerKeys, TonClient} from '@tonclient/core';
import * as ed from 'noble-ed25519';
import crypto from 'crypto';
import {LoggingService} from "@/libs/logging/services/logging.service";

@Injectable()
export class EverscaleClientService implements IEverscaleClientService {
  private logger: LoggingService;
  private tonClient: TonClient;
  private idxVcFabricAdminAccount: Account;

  init(params: IEverscaleClientsParamsInit, logger: LoggingService): void {
    const {
      everscaleAdminAddressesKeys,
      idxVcFabricContractAbiBase64,
      idxVcFabricContractTvcBase64,
      defaultNetwork,
      networks
    } = params;

    this.logger = logger;

    TonClient.useBinaryLibrary(libNode);
    this.tonClient = new TonClient({network: {endpoints: networks[defaultNetwork]}});

    const idxVcFabricContractAbiJson = Buffer.from(idxVcFabricContractAbiBase64, 'base64').toString()
    const idxVcFabricContractAbi = JSON.parse(idxVcFabricContractAbiJson);
    const idxVcFabricContract = {
      abi: idxVcFabricContractAbi,
      tvc: idxVcFabricContractTvcBase64
    };

    this.idxVcFabricAdminAccount = new Account(
      idxVcFabricContract,
      {
        signer: signerKeys(everscaleAdminAddressesKeys.idxVcFabric),
        client: this.tonClient
      }
    );
  }

  async generateKeys(): Promise<{public: string, secret: string}> {
    return await this.tonClient.crypto.generate_random_sign_keys();
  }

  /**
   * https://github.com/tonlabs/ever-sdk-js/blob/c2ebf34ebb5e58d0b531baab322a3bb358502055/packages/tests/src/tests/crypto.ts
   *
   * @param input
   */
  async verifySignature(input: {
    signed: string,
    message: string,
    publicKey: string
  }): Promise<boolean> {
    const {signed, message, publicKey} = input;
    const hash = Buffer.from(message, 'binary').toString('base64');

    const result = await this.tonClient.crypto.verify_signature({
      public: publicKey,
      signed,
    });

    return result.unsigned === hash;
  }

  /**
   * https://github.com/tonlabs/ever-sdk-js/blob/c2ebf34ebb5e58d0b531baab322a3bb358502055/packages/tests/src/tests/crypto.ts
   *
   * @param input
   */
  async signMessage(input: {
    message: string,
    keys: {public: string, secret: string}
  }): Promise<{signed: string, signature: string}> {
    const { message, keys } = input;
    const hash = Buffer.from(message, 'binary').toString('base64');
    return this.tonClient.crypto.sign({keys, unsigned: hash})
  }
}
