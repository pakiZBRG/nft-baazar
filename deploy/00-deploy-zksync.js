const { Wallet, utils } = require('zksync-web3');
const { Deployer } = require('@matterlabs/hardhat-zksync-deploy');
const ethers = require('ethers');
const path = require('path');
const fs = require('fs');

const CONTRACT_ADDRESS_PATH = path.join(__dirname, '../client/contract/contractAddress.json');
const chainId = 280;
const contractAddress = JSON.parse(fs.readFileSync(CONTRACT_ADDRESS_PATH, 'utf8'));

module.exports = async (hre) => {
  console.log('Running deploy script for the Marketplace contract on zkSync...');

  const wallet = new Wallet(`0x${process.env.PRIVATE_KEY}`);

  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact('Marketplace');

  // Deposit some funds to L2 in order to be able to perform L2 transactions.
  const depositAmount = ethers.utils.parseEther('0.1');
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: depositAmount,
  });
  // Wait until the deposit is processed on zkSync
  await depositHandle.wait();

  // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
  const contract = await deployer.deploy(artifact);

  console.log(`${artifact.contractName} was deployed to ${contract.address}`);

  if (chainId in contractAddress) {
    if (!contractAddress[chainId].includes(contract.address)) {
      contractAddress[chainId] = contract.address;
    }
  } else {
    contractAddress[chainId] = contract.address;
  }

  fs.writeFileSync(CONTRACT_ADDRESS_PATH, JSON.stringify(contractAddress));

  console.log('Contract address added in frontend!');
};

module.exports.tags = ['zksync'];
