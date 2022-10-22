const networkConfig = {
  5: {
    name: 'goerli',
  },
  80001: {
    name: 'mumbai',
  },
  31337: {
    name: 'localhost',
  },
};

const developmentChains = ['hardhat', 'localhost'];

module.exports = {
  networkConfig,
  developmentChains,
};
