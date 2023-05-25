import { registerAs } from '@nestjs/config';
import { EverscaleClientConfiguration } from '../types';

export default registerAs('everscale-client-configuration', (): EverscaleClientConfiguration => ({
  everscaleSignerAddressesPath: process.env.PATH_TO_EVERSCALE_SIGNER_ADDRESSES,
  defaultNetwork:  process.env.DEFAULT_EVERSCALE_NETWORK,
  networks: {
    mainnet: process.env.MAINNET_EVERSCALE_HOSTS.split(','),
    testnet: process.env.TESTNET_EVERSCALE_HOSTS.split(',')
  },
  contractsAddresses: {
    idxVcFabric: process.env.IDX_VC_FABRIC_CONTRACT_ADDRESS,
    idxDidDoc: process.env.IDX_DID_DOCUMENT_CONTRACT_ADDRESS,
    idxDidRegistry: process.env.IDX_DID_REGISTRY_CONTRACT_ADDRESS
  },
}));
