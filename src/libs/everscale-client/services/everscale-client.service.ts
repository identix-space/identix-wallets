import { Injectable } from "@nestjs/common";
import {ClaimsGroup, IEverscaleClientService, IEverscaleClientsParamsInit} from "@/libs/everscale-client/types";

import {Account} from '@tonclient/appkit';
import {libNode} from '@tonclient/lib-node';
import {KeyPair, signerKeys, TonClient} from '@tonclient/core';
import {LoggingService} from "@/libs/logging/services/logging.service";
import {readFileAsBase64} from "@/libs/common/helpers/files.helpers";
import {Did} from "../types";
import {join} from 'path';
import {faker} from "@faker-js/faker";

const idxVcFabricContractAbi = require('../contracts/vc-management/IdxVcFabric.abi.json'); // eslint-disable-line @typescript-eslint/no-var-requires
const idxDidDocContractAbi = require('../contracts/did-management/IdxDidDocument.abi.json' ); // eslint-disable-line @typescript-eslint/no-var-requires
const idxDidRegistryContractAbi = require('../contracts/did-management/IdxDidRegistry.abi.json' ); // eslint-disable-line @typescript-eslint/no-var-requires

@Injectable()
export class EverscaleClientService implements IEverscaleClientService {
  private logger: LoggingService;
  private tonClient: TonClient;
  private idxVcFabricAdminAccount: Account;
  private idxDidDocAccount: Account;
  private idxDidRegistryAccount: Account;

  async init(params: IEverscaleClientsParamsInit, logger: LoggingService): Promise<void> {
    const {
      everscaleSignerAddresses,
      defaultNetwork,
      contractsAddresses,
      networks
    } = params;

    this.logger = logger;

    TonClient.useBinaryLibrary(libNode);
    this.tonClient = new TonClient({network: {endpoints: networks[defaultNetwork]}});

    const pathTvc = join(__dirname, '../contracts/vc-management/IdxVcFabric.tvc');
    const idxVcFabricContract = {
      abi: idxVcFabricContractAbi,
      tvc: await readFileAsBase64(join(__dirname, '../contracts/vc-management/IdxVcFabric.tvc'))
    };

    this.idxVcFabricAdminAccount = new Account(
      idxVcFabricContract,
      {
        address: contractsAddresses.dxVcFabric,
        signer: signerKeys(everscaleSignerAddresses.idxVcFabric.keys),
        client: this.tonClient
      }
    );

    const idxDidDocContract = {
      abi: idxDidDocContractAbi,
      tvc: await readFileAsBase64(join(__dirname, '../contracts/did-management/IdxDidDocument.tvc'))
    };

    this.idxDidDocAccount = new Account(idxDidDocContract, {
      address: contractsAddresses.idxDidDoc,
      client: this.tonClient
    });

    const idxDidRegistryContract = {
      abi: idxDidRegistryContractAbi,
      tvc: await readFileAsBase64(join(__dirname, '../contracts/did-management/IdxDidRegistry.tvc'))
    };

    this.idxDidRegistryAccount = new Account(idxDidRegistryContract, {
      address: contractsAddresses.idxDidRegistry,
      signer: signerKeys(everscaleSignerAddresses.didRegistry.keys),
      client: this.tonClient
    });

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

    const result = await this.tonClient.crypto.verify_signature({
      public: publicKey,
      signed,
    });

    return result.unsigned === this.text2base64(message);
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

    return this.tonClient.crypto.sign({keys, unsigned: this.text2base64(message)})
  }

  async getDidDocumentPublicKey(didDocumentAddress: string): Promise<string> {
    const res = await this.idxDidDocAccount.runLocal('getSubjectPubKey', {});
    await this.idxDidDocAccount.free();
    return res.decoded?.output.value0;
  }

  async issueDidDocument(publicKey: string): Promise<Did> {
    const newDidDoc = await this.idxDidRegistryAccount.run('issueDidDoc', {
      answerId: 0,
      subjectPubKey: `0x${publicKey}`,
      salt: '0',
      didController: '0:0000000000000000000000000000000000000000000000000000000000000000'
    });
    const newDidAddress = newDidDoc.decoded?.output.didDocAddr;
    await this.idxDidRegistryAccount.free();
    return newDidAddress;
  }

  async issuerVC(claims: ClaimsGroup[], issuerPubKey: string): Promise<Did> {
    const claimsGroupsMock = [
      {
        hmacHigh_claimGroup: this.randomLengthString(64),
        hmacHigh_groupDid: this.randomLengthString(64),
        signHighPart: this.randomLengthString(256),
        signLowPart: this.randomLengthString(256)
      },
      {
        hmacHigh_claimGroup: this.randomLengthString(64),
        hmacHigh_groupDid: this.randomLengthString(64),
        signHighPart: this.randomLengthString(256),
        signLowPart: this.randomLengthString(256)
      }
    ]
    const issuerPubKeyMock = "8e6d7b90ac4b88d415b1a9f4fb234ed7332076281d432bb93d165284fc816f57"

    const vc = await this.idxVcFabricAdminAccount.run('issueVc', { claims: claimsGroupsMock, issuerPubKey: issuerPubKeyMock});
    const vcDidAddress = vc.decoded?.output.vcAddress;
    await this.idxDidRegistryAccount.free();

    return vcDidAddress;
  }

  private text2base64(text: string): string {
    return Buffer.from(text, "utf8").toString("base64");
  }

  private randomLengthString(lengthInBits: number): Buffer {
    return Buffer.from(faker.random.alphaNumeric(30), "utf8").slice(0, lengthInBits / 8);
  }
}
