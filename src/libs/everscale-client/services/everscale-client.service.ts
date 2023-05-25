import { Injectable } from "@nestjs/common";
import {ClaimsGroup, IEverscaleClientService, IEverscaleClientsParamsInit} from "@/libs/everscale-client/types";

import {Account} from '@eversdk/appkit';
import {libNode} from '@eversdk/lib-node';
import {signerKeys, TonClient} from '@eversdk/core';
import {LoggingService} from "@/libs/logging/services/logging.service";
import {readFileAsBase64} from "@/libs/common/helpers/files.helpers";
import {Did} from "../types";
import {join} from 'path';

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
    this.tonClient = new TonClient({network: {endpoints: networks[defaultNetwork], access_key: "cc420dce6bdb4e90abe83fed2fead1e2"}});

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
      signer: signerKeys(everscaleSignerAddresses.idxVcFabric.keys),
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

  async issueVC(claims: ClaimsGroup[], issuerPubKey: string): Promise<Did> {
    const claimsGroupsMock = [
      {
        hmacHigh_claimGroup: String(this.getRandom64()),
        hmacHigh_groupDid: String(this.getRandom64()),
        signHighPart: [this.getRandom64(), this.getRandom64(), this.getRandom64(), this.getRandom64()].join(''),
        signLowPart: [this.getRandom64(), this.getRandom64(), this.getRandom64(), this.getRandom64()].join(''),
      },
      {
        hmacHigh_claimGroup: String(this.getRandom64()),
        hmacHigh_groupDid: String(this.getRandom64()),
        signHighPart: [this.getRandom64(), this.getRandom64(), this.getRandom64(), this.getRandom64()].join(''),
        signLowPart: [this.getRandom64(), this.getRandom64(), this.getRandom64(), this.getRandom64()].join(''),
      }
    ]
    const issuerPubKeyMock = "0xe73cefdc839b7b6ffcb5325d4f0ad8995089924563ed2573036df5877ff1148e";
    const vc = await this.idxVcFabricAdminAccount.run('issueVc', { answerId: 0, claims: claimsGroupsMock, issuerPubKey: issuerPubKeyMock});
    console.log(vc);
    const vcDidAddress = vc.decoded?.output.vcAddress;
    await this.idxDidRegistryAccount.free();

    return vcDidAddress;
  }

  private text2base64(text: string): string {
    return Buffer.from(text, "utf8").toString("base64");
  }

  private randomLengthString(lengthInBits: number): string {
    return "4234123412341234123412341234123413243";
  }

  private getRandom64() {
    return 3945411112832729000;
  }
}
