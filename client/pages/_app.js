import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import { create } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';

import { Nav, Footer } from '../components';
import { abi, contractAddress } from '../contract';
import '../styles/main.css';
import { networks } from '../utils';

let provider;
let signer;
if (typeof window !== 'undefined') {
  provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  signer = provider.getSigner();
}

const projectId = process.env.NEXT_PUBLIC_IPFS_ID;
const projectSecret = process.env.NEXT_PUBLIC_IPFS_SECRET;
const gateway = process.env.NEXT_PUBLIC_GATEWAY;

const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const [account, setAccount] = useState({ address: '', balance: '' });
  const [installMetamask, setInstallMetamask] = useState(false);
  const [switchNetwork, setSwitchNetwork] = useState(false);
  const [chainId, setChainId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [deployedNetworks, setDeployedNetworks] = useState([]);
  const [currency, setCurrency] = useState('');
  const [openImage, setOpenImage] = useState(false);
  const [openNavbar, setOpenNavbar] = useState(false);

  const getContract = async (signerOrProvider) => {
    try {
      const network = await provider.getNetwork();
      const address = contractAddress[network.chainId.toString()];
      const contract = new ethers.Contract(address, abi, signerOrProvider);
      return contract;
    } catch (error) {
      console.log(error.message);
    }
  };

  const connectWallet = async () => {
    try {
      const accounts = await provider.send('eth_requestAccounts', []);
      const balance = await signer.getBalance();
      setAccount({ address: accounts[0], balance });
      setIsLoggedIn(true);
    } catch (error) {
      if (error.code === 4001) {
        toast.info('Please connect to MetaMask.');
      }
    }
  };

  const isConnected = async () => {
    try {
      const address = await signer.getAddress();
      return address;
    } catch (error) {
      console.log(error.message);
    }
  };

  const getCurrentNetwork = async () => {
    const available = Object.keys(contractAddress).map((key) => key);
    setDeployedNetworks(available);
    try {
      const network = await provider.getNetwork();
      setChainId(`0x${network.chainId.toString(16)}`);
      setSwitchNetwork(Boolean(!contractAddress[+network.chainId]));
      const selectedNetwork = networks.find((net) => net.chainId === `0x${network.chainId.toString(16)}`);
      setCurrency(selectedNetwork?.nativeCurrency.symbol);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (typeof ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length) {
          connectWallet();
        } else {
          setAccount({ address: '', balance: '' });
          setIsLoggedIn(false);
        }
      });
      window.ethereum.on('chainChanged', (networkId) => {
        router.push('/');
        connectWallet();
        getCurrentNetwork();
        if (contractAddress[+networkId]) {
          setSwitchNetwork(false);
        } else {
          setSwitchNetwork(true);
        }
      });

      getCurrentNetwork();
      isConnected()
        .then((addr) => addr && connectWallet())
        .catch((err) => console.log(err.message));
    } else {
      setInstallMetamask(true);
    }
  }, []);

  const props = { ...pageProps, currency, ipfs, gateway, signer, provider, getContract, account, setShowSellModal, showSellModal, openImage, setOpenImage, setAccount };

  useEffect(() => {
    document.body.style.overflow = openNavbar || showModal ? 'hidden' : 'visible';
  }, [openNavbar, showModal]);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>NFT Baazar</title>
      </Head>
      <ToastContainer position="bottom-right" theme="dark" />
      {(showModal || showSellModal || openImage) && <div className="absolute w-full backdrop-blur-md backdrop-brightness-[30%] z-30 h-screen" />}
      <div className={`absolute tablet:hidden ease-in ${openNavbar ? 'h-screen' : 'h-0'} duration-500 w-full backdrop-blur-md backdrop-brightness-50 z-30`} />
      <div className="gradient-background">
        <div className="min-h-screen flex flex-col">
          <Nav
            connectWallet={connectWallet}
            account={account}
            installMetamask={installMetamask}
            switchNetwork={switchNetwork}
            chainId={chainId}
            setChainId={setChainId}
            setShowModal={setShowModal}
            showModal={showModal}
            isLoggedIn={isLoggedIn}
            deployedNetworks={deployedNetworks}
            setOpenNavbar={setOpenNavbar}
            openNavbar={openNavbar}
            currency={currency}
          />
          <div className="w-11/12 mx-auto">
            <Component {...props} />
          </div>
        </div>
        <Footer getContract={getContract} provider={provider} />
      </div>
    </>
  );
};

export default MyApp;
