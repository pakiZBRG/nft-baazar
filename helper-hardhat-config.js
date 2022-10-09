const networkConfig = {
  5: {
    name: 'goerli',
    ethUsdPriceFeed: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
  },
  80001: {
    name: 'mumbai',
    ethUsdPriceFeed: '0x0715A7794a1dc8e42615F059dD6e406A6594651A',
  },
  31337: {
    name: 'localhost',
  },
};

const BASE_FEE = ethers.utils.parseEther('0.25'); // 0.25 LINK per request
const GAS_PRICE_LINK = 1e9;
const DECIMALS = 8;
const INITIAL_ANSWER = 2000 * 1e8;

const developmentChains = ['hardhat', 'localhost'];

module.exports = {
  networkConfig,
  developmentChains,
  BASE_FEE,
  GAS_PRICE_LINK,
  DECIMALS,
  INITIAL_ANSWER,
};
