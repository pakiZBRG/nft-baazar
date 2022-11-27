const { ethers } = require('hardhat');

const main = async () => {
  const Contract = await ethers.getContractFactory('Marketplace');
  const contract = await Contract.deploy();
  console.log(contract.address);
};

main()
  .then(() => process.exit(1))
  .catch((err) => {
    console.log(err.message);
    process.exit(0);
  });
