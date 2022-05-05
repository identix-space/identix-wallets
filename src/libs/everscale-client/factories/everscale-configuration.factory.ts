import { registerAs } from '@nestjs/config';
import { EverscaleClientConfiguration } from '../types';

export default registerAs('everscale-client-configuration', (): EverscaleClientConfiguration => ({
  everscaleAdminAddressesKeysPath: process.env.PATH_TO_EVERSCALE_ADMIN_ADDRESSES_KEYS,
  defaultNetwork:  process.env.DEFAULT_EVERSCALE_NETWORK,
  networks: {
    mainnet: process.env.MAINNET_EVERSCALE_HOSTS.split(','),
    testnet: process.env.TESTNET_EVERSCALE_HOSTS.split(',')
  }
}));
