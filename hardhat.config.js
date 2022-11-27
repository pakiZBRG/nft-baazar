require('@matterlabs/hardhat-zksync-deploy');
require('@matterlabs/hardhat-zksync-solc');
require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-waffle');
require('solidity-coverage');
require('hardhat-deploy');
require('dotenv').config();

module.exports = {
  zksolc: {
    version: '1.2.0',
    compilerSource: 'binary',
  },
  zkSyncDeploy: {
    zkSyncNetwork: 'https://zksync2-testnet.zksync.dev',
    ethNetwork: process.env.GOERLI_RPC_URL,
  },
  solidity: {
    version: '0.8.16',
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      zksync: true,
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 6,
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 80001,
      blockConfirmations: 6,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, // default to account[0]
    },
    player: {
      default: 1, // default to account[1]
    },
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
    },
  },
  mocha: {
    timeout: 600000, // 10min
  },
};
