import { ethers } from 'ethers';

// shorten address -> first 5 chars and last 4
const shortenAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;

// format hex to int
const formatBigNumber = (price, decimal) => {
  const string = ethers.utils.formatEther(price);
  const integer = parseFloat(string).toFixed(decimal);
  return integer;
};

// https://chainid.network/chains.json
const networks = [
  {
    chainId: `0x${Number(31337).toString(16)}`,
    chainName: 'Localhost',
    nativeCurrency: {
      name: 'CPAY',
      symbol: 'CPAY',
      decimals: 18,
    },
    rpcUrls: ['http://localhost:8545'],
  },
  {
    chainId: `0x${Number(5).toString(16)}`,
    chainName: 'Goerli',
    nativeCurrency: {
      name: 'Görli Ether',
      symbol: 'GoerliETH',
      decimals: 18,
    },
    rpcUrls: [
      'https://goerli.infura.io/v3/4c8019e7624d43ce8e9a60dbe3720b40',
      'wss://goerli.infura.io/v3/4c8019e7624d43ce8e9a60dbe3720b40',
      'https://rpc.goerli.mudit.blog/',
    ],
    blockExplorerUrls: ['https://goerli.etherscan.io'],
    iconUrls: [
      'https://cdn.freebiesupply.com/logos/large/2x/ethereum-1-logo-png-transparent.png',
      '/eth-logo.png',
    ],
  },
  {
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: 'Mumbai',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: [
      'https://matic-mumbai.chainstacklabs.com',
      'https://rpc-mumbai.maticvigil.com',
      'https://matic-testnet-archive-rpc.bwarelabs.com',
    ],
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
    iconUrls: [
      'https://img.api.cryptorank.io/coins/polygon1624610763534.png',
      '/polygon-logo.png',
    ],
  },
];

export {
  shortenAddress,
  formatBigNumber,
  networks,
};
