const { assert, expect } = require('chai');
const { network, getNamedAccounts, deployments, ethers } = require('hardhat');
const { developmentChains } = require('../helper-hardhat-config');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Contract', async () => {
    let contract; let
      deployer;

    beforeEach(async () => {
      deployer = (await getNamedAccounts()).deployer;
      await deployments.fixture(['all']);
      const Contract = await ethers.getContractFactory('Marketplace', deployer);
      contract = await Contract.deploy();
    });
  });
