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

  async verifyMessage(input: {
    signatureHex: string,
    message: string,
    publicKey: string
  }): Promise<boolean> {
    const hash = crypto.createHash('sha256').update(input.message).digest('hex');
    return await ed.verify(input.signatureHex, hash, input.publicKey);
  }

  async signMessage(input: {
    message: string,
    privateKey: string
  }): Promise<string> {
    const msgHash = crypto.createHash('sha256').update(input.message).digest('hex');
    return await ed.sign(msgHash, input.privateKey);
  }
}
