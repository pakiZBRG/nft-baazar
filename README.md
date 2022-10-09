Basic Hardhat template for building extensive smart contracts with frontend. You can test your contracts locally and on testnets (Goerli and Mumbai). It supports Goerli and Mumbai test networks. 

# Hardhat Setup
- [Setup environment variables](#setup-environment-variables)
- [Install](#install)
  - [ERESOLVE unable to resolve dependency tree](#eresolve-unable-to-resolve-dependency-tree)
- [Scripts](#scripts)
- [Template for building Hardhat projects in Solidity](#template-for-building-hardhat-projects-in-solidity)
- [Frontend](#frontend)
- [Eslint Config](#eslint-config)

## Setup environment variables
- `PRIVATE_KEY` - private key of one of your Metamask accounts
- `GOERLI_RPC_URL` - Goerli RPC URL from [Infura](https://infura.io/dashboard)
- `MUMBAI_RPC_URL` - Mumbai RPC URL from [Infura](https://infura.io/dashboard)
- `ETHERSCAN_API_KEY` - API key from [Etherscan](https://etherscan.io/) for contract verification
- `POLYGONSCAN_API_KEY` - API key from [Polygonscan](https://polygonscan.com/) for contract verification

## Install
When utlizing the `npm i` command, both contract and client dependecies will be installed.

### ERESOLVE unable to resolve dependency tree
If `npm i` throws an error:
```
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! 
npm ERR! While resolving: template@1.0.0
npm ERR! Found: @nomiclabs/hardhat-ethers@0.3.0-beta.13
npm ERR! node_modules/@nomiclabs/hardhat-ethers
npm ERR!   @nomiclabs/hardhat-ethers@"npm:hardhat-deploy-ethers@^0.3.0-beta.13" from the root project
npm ERR! 
```
use `npm i --force` instead.

## Scripts
Run client
```
npm run client
```
Run blockchain
```
npm run blockchain
```
Run client and blockchain (locally)
```
npm run dev
```
Deploy to **Goerli** testnet
```
npm run deploy:goerli
```
Deploy to **Mumbai** testnet
```
npm run deploy:mumbai
```

## Template for building Hardhat projects in Solidity
Run the tests
```
hh test
```
Run the scripts
```
hh run scripts/main.js
```
Compile the smart contracts
```
hh compile
```
Deploy contracts
```
hh deploy --network network_name
```
Spin up your local blockchain
```
hh node
```
Deploy contract to **Goerli**
```
hh deploy --network goerli
```
Deploy contract to **Mumbai**
```
hh deploy --network mumbai
```

## Frontend
Frontend is built using Vite, React and TailwindCSS

## Eslint Config
Reconfigure eslint
```
npx eslint --init
```