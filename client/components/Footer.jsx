import React, { useEffect, useState, useCallback } from 'react';
import { HiOutlineExternalLink } from 'react-icons/hi';

const Footer = ({ getContract, provider, deployedNetworks }) => {
  const [contractLink, setContractLink] = useState('');

  const setContract = useCallback(async () => {
    const contract = await getContract(provider);
    const network = await provider.getNetwork();

    switch (network.chainId === deployedNetworks) {
      case 5:
        setContractLink(`https://goerli.etherscan.io/address/${contract.address}`);
        break;
      case 80001:
        setContractLink(`https://mumbai.polygonscan.com/address/${contract.address}`);
        break;
      case 31337:
        setContractLink('');
        break;
      default:
        break;
    }
  }, [getContract, provider]);

  useEffect(() => {
    setContract();
  }, [setContract]);

  return (
    <div className="text-white p-5">
      <div className="bg-zinc-100 opacity-[7%] w-full h-[1px] mb-6" />
      <div className="w-11/12 mx-auto flex tablet:flex-row flex-col text-sm justify-between">
        <p className="opacity-30 flex-1 m-4">NFT Marketplace built using Next.js and TailwindCSS on frontend and Solidity on the backend on Mumbai and Goerli testnets, as well as localhost. Create, Sell, Buy and View transaction history.</p>
        <div className="flex-1 m-4">
          {contractLink
            && (
              <a
                target="_blank"
                href={contractLink}
                rel="noreferrer"
                className="flex items-center hover:underline mb-1"
              >
                <HiOutlineExternalLink className="mr-1" />View Contract
              </a>
            )}
          <a
            target="_blank"
            href="https://github.com/pakiZBRG/nft-baazar"
            rel="noreferrer"
            className="flex items-center hover:underline"
          >
            <HiOutlineExternalLink className="mr-1" />View Code
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
