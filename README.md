# NFT Marketplace on Which You Can Mint and Sell/Buy NFTs

> Currently deployed on **Goerli**, **Mumbai** and **zkSync**
## Hardhat Setup
- [Setup environment variables](#setup-environment-variables)
- [Install](#install)
- [Scripts](#scripts)
- [Template for building Hardhat projects in Solidity](#template-for-building-hardhat-projects-in-solidity)
- [Frontend](#frontend)
- [Eslint Config](#eslint-config)
- [Miscellaneous](#miscellaneous)

## Setup environment variables
- `PRIVATE_KEY` - private key of one of your Metamask accounts
- `GOERLI_RPC_URL` - Goerli RPC URL from [Alchemy](https://dashboard.alchemy.com/)
- `MUMBAI_RPC_URL` - Mumbai RPC URL from [Alchemy](https://dashboard.alchemy.com/)
- `ETHERSCAN_API_KEY` - API key from [Etherscan](https://etherscan.io/) for contract verification
- `POLYGONSCAN_API_KEY` - API key from [Polygonscan](https://polygonscan.com/) for contract verification

## Install
When utlizing the `npm i` command, both contract and client dependecies will be installed.

## Scripts
Run client
```
npm run client
```
Run blockchain locally
```
npm run blockchain
```
Run client and blockchain (locally)
```
npm run dev
Flatten the contract
```
npm run flatten
```
Deploy to **Goerli** testnet
```
npm run deploy:goerli
```
Deploy to **Mumbai** testnet
```
npm run deploy:mumbai
```
Deploy to **zkSync** testnet
```
npm run deploy:zksync
```

## Frontend
Frontend is built using Next.js and TailwindCSS

## Eslint Config
Reconfigure eslint
```
npx eslint --init
```

## Miscellaneous
### Nonce too high. Expected nonce to be 0 but got 2
[Solution](https://medium.com/@thelasthash/solved-nonce-too-high-error-with-metamask-and-hardhat-adc66f092cd)
