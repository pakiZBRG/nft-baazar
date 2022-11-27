const path = require('path');
const fs = require('fs');
const { ethers, network } = require('hardhat');

const ABI_PATH = path.join(__dirname, '../client/contract/ABI.json');
const CONTRACT_ADDRESS_PATH = path.join(__dirname, '../client/contract/contractAddress.json');

const updateContractAddress = async () => {
  const chainId = network.config.chainId.toString();
  const Contract = await ethers.getContractFactory('Marketplace');
  const contract = await Contract.deploy();
  const contractAddress = JSON.parse(fs.readFileSync(CONTRACT_ADDRESS_PATH, 'utf8'));

  if (chainId in contractAddress) {
    if (!contractAddress[chainId].includes(contract.address)) {
      contractAddress[chainId] = contract.address;
    }
  } else {
    contractAddress[chainId] = contract.address;
  }

  fs.writeFileSync(CONTRACT_ADDRESS_PATH, JSON.stringify(contractAddress));
};

const updateABI = async () => {
  const Contract = await ethers.getContractFactory('Marketplace');
  const contract = await Contract.deploy();
  fs.writeFileSync(ABI_PATH, contract.interface.format(ethers.utils.FormatTypes.json));
};

module.exports = async () => {
  console.log('Writing ABI and contract address to frontend...');
  await updateContractAddress();
  await updateABI();
  console.log('ABI and contract address are saved in frontend!');
};

module.exports.tags = ['testnet', 'frontend'];
