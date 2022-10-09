import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import { Nav } from './components';
import { abi, contractAddress } from './contract';
import 'react-toastify/dist/ReactToastify.css';

let provider;
let signer;
if (window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  signer = provider.getSigner();
}

const App = () => {
  const [account, setAccount] = useState({ address: '', balance: '' });
  const [installMetamask, setInstallMetamask] = useState(false);
  const [switchNetwork, setSwitchNetwork] = useState(false);
  const [chainId, setChainId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [deployedNetworks, setDeployedNetworks] = useState([]);

  const getContract = async (signerOrProvider) => {
    const network = await provider.getNetwork();
    const address = contractAddress[network.chainId.toString()];
    const contract = new ethers.Contract(address, abi, signerOrProvider);
    return contract;
  };

  const connectWallet = async () => {
    try {
      const accounts = await provider.send('eth_requestAccounts', []);
      const balance = await signer.getBalance();
      setAccount({ address: accounts[0], balance });
      localStorage.setItem('nft_marketplace', true);
      setIsLoggedIn(true);
    } catch (error) {
      if (error.code === 4001) {
        toast.info('Please connect to MetaMask.');
      }
    }
  };

  const isConnected = async () => {
    const address = await signer.getAddress();
    return address;
  };

  const getCurrentNetwork = async () => {
    const available = Object.keys(contractAddress).map((key) => key);
    setDeployedNetworks(available);
    const network = await provider.getNetwork();
    setChainId(`0x${network.chainId.toString(16)}`);
    setSwitchNetwork(Boolean(!contractAddress[+network.chainId]));
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
        connectWallet();
        if (contractAddress[+networkId]) {
          setSwitchNetwork(false);
        } else {
          setSwitchNetwork(true);
        }
      });

      getCurrentNetwork();
      isConnected()
        .then(() => connectWallet())
        .catch((err) => console.log(err.message));
    } else {
      setInstallMetamask(true);
    }
  }, []);

  return (
    <>
      <ToastContainer position="bottom-right" theme="dark" />
      {showModal && <div className="absolute w-screen h-screen bg-gray-900 opacity-80 z-10" />}
      <div className="min-h-screen gradient-background flex flex-col">
        <Nav
          connectWallet={connectWallet}
          account={account}
          installMetamask={installMetamask}
          switchNetwork={switchNetwork}
          chainId={chainId}
          setChainId={setChainId}
          setShowModal={setShowModal}
          showModal={showModal}
          setIsLoggedIn={setIsLoggedIn}
          isLoggedIn={isLoggedIn}
          deployedNetworks={deployedNetworks}
        />
        <div className="flex items-center justify-center">
          {!isLoggedIn
            ? <p className="text-center mt-16 text-slate-200">Connect to Metamask</p>
            : (
              <p className="text-center mt-16 text-slate-200">You are connected</p>
            )}
        </div>
      </div>
    </>
  );
};

export default App;
