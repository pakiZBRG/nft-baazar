import { useRef, useEffect, useState } from 'react';
import { FaWallet } from 'react-icons/fa';
import { RiErrorWarningLine } from 'react-icons/ri';
import { MdKeyboardArrowDown, MdOutlineContentCopy } from 'react-icons/md';
import { TiTick } from 'react-icons/ti';
import { HiOutlineExternalLink } from 'react-icons/hi';
import jazzicon from '@metamask/jazzicon';

import { formatBigNumber, networks, shortenAddress } from '../utils';

const Nav = ({ account, installMetamask, connectWallet, switchNetwork, chainId, setChainId, setShowModal, showModal, isLoggedIn, setIsLoggedIn, deployedNetworks }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState({});
  const [copied, setCopied] = useState(false);
  const avatarRef = useRef();
  const modalRef = useRef();
  const { address, balance } = account;

  // close modal when clicking outside of it
  useEffect(() => {
    const closeModal = (e) => setShowModal(modalRef?.current?.contains(e.target));
    document.addEventListener('mousedown', closeModal);
    return () => document.removeEventListener('mousedown', closeModal);
  }, []);

  useEffect(() => {
    const selectedNetwork = networks.find((net) => net.chainId === chainId);
    setActiveNetwork(selectedNetwork);
  }, [chainId]);

  useEffect(() => {
    let timer;
    if (copied) {
      timer = setTimeout(() => setCopied(false), 1000);
    }
    return () => clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    const element = avatarRef.current;
    if (element && address) {
      const addr = address.slice(2, 10);
      const seed = parseInt(addr, 16);
      const icon = jazzicon(20, seed);
      if (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      element.appendChild(icon);
    }
  }, [address, avatarRef, switchNetwork, isLoggedIn, showModal]);

  const changeNetwork = async (chainName) => {
    const chain = networks.find((net) => net.chainName === chainName);
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chain.chainId }],
      });
      setChainId(chain.chainId);
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [chain],
          });
          setChainId(chain.chainId);
        } catch (addError) {
          console.log(error.message);
        }
      }
      console.log(error.message);
    }
  };

  const disconnect = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('nft_marketplace');
    setShowModal(false);
  };

  return (
    <nav className="flex justify-between mt-5">
      <div className="flex items-center">
        <img src="/eth-colored.png" className="h-8 mx-4" />
        <h1 className="text-xl  text-slate-100">Template</h1>
      </div>
      {isLoggedIn
        ? (
          !switchNetwork
            ? (
              <div className="flex">
                <div
                  className="relative flex items-center black-glassmorphism text-white px-3 py-[7px] mx-3 rounded-2xl cursor-default"
                  onMouseEnter={() => setShowDialog(true)}
                  onMouseLeave={() => setShowDialog(false)}
                >
                  {activeNetwork.iconUrls
                    && <img src={activeNetwork.iconUrls[1]} alt="logo" width="20" height="20" className="mr-2" />}
                  {activeNetwork.chainName}
                </div>
                {showDialog
                  && (
                    <>
                      <div
                        className="absolute w-60 top-[50px] h-3 display-none"
                        onMouseEnter={() => setShowDialog(true)}
                        onMouseLeave={() => setShowDialog(false)}
                      />
                      <div
                        className="absolute top-[62px] w-[220px] px-4 py-3 rounded-2xl black-glassmorphism"
                        onMouseEnter={() => setShowDialog(true)}
                        onMouseLeave={() => setShowDialog(false)}
                      >
                        <p className="text-sm text-slate-200 mb-3">Select a network</p>
                        {networks.filter((net) => deployedNetworks.includes(parseInt(net.chainId, 16).toString())).map((chain) => (
                          <div
                            onClick={() => changeNetwork(chain.chainName)}
                            className={`flex justify-between items-center p-1 mb-1 cursor-${chain.chainId !== chainId ? 'pointer' : 'default'}`}
                            key={chain.chainId}
                          >
                            <div className="flex">
                              {chain.iconUrls
                                ? <img src={chain.iconUrls[1]} alt="logo" width="20" height="20" /> : <span className="ml-5" />}
                              <p className="ml-2 text-white font-bold text-sm">{chain.chainName}</p>
                            </div>
                            {chain.chainId === chainId
                              && <span className="w-2 h-2 bg-green-500 rounded-full" />}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                <div className="text-sm mr-5 text-white px-[2px] py-[2px] black-glassmorphism rounded-2xl flex items-center">
                  <p className="font-bold text-base mx-3 address-font">{formatBigNumber(balance, 3)}</p>
                  <div className="flex white-glassmorphism px-3 py-1 rounded-[14.5px] pt-[6px] pb-[2px] cursor-pointer border border-transparent hover:border-slate-600" onClick={() => setShowModal(true)}>
                    <p className="mr-2 font-bold text-base address-font">{shortenAddress(address)}</p>
                    <div ref={avatarRef} />
                  </div>
                </div>
              </div>
            )
            : (
              <div>
                <div
                  className="flex items-center bg-rose-600 text-white px-5 py-[7px] mx-5 rounded-2xl cursor-default"
                  onMouseEnter={() => setShowDialog(true)}
                  onMouseLeave={() => setShowDialog(false)}
                >
                  <RiErrorWarningLine className="text-lg mr-3" />
                  Switch network
                  <MdKeyboardArrowDown className="text-lg ml-2" />
                </div>
                {showDialog
                  && (
                    <>
                      <div
                        className="absolute w-52 right-[15px] h-1 opacity-0"
                        onMouseEnter={() => setShowDialog(true)}
                        onMouseLeave={() => setShowDialog(false)}
                      />
                      <div
                        className="absolute right-[20px] top-[62px] w-[250px] px-4 py-3 rounded-2xl black-glassmorphism"
                        onMouseEnter={() => setShowDialog(true)}
                        onMouseLeave={() => setShowDialog(false)}
                      >
                        <p className="text-sm text-slate-200 mb-3">Select a supported network</p>
                        {networks.filter((net) => deployedNetworks.includes(parseInt(net.chainId, 16).toString())).map((chain) => (
                          <div
                            onClick={() => changeNetwork(chain.chainName)}
                            className="flex items-center p-1 mb-1 cursor-pointer"
                            key={chain.chainId}
                          >
                            {chain.iconUrls
                              ? <img src={chain.iconUrls[1]} alt="logo" width="20" height="20" /> : <span className="ml-5" />}
                            <p className="ml-2 text-white font-bold text-sm">{chain.chainName}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
              </div>
            )
        )
        : (
          <div>
            {!installMetamask
              ? (
                <button
                  type="button"
                  className="py-[6.5px] px-6 mr-6 rounded-2xl text-white bg-sky-700 hover:shadow-sky-900/40 duration-300 shadow-xl"
                  onClick={connectWallet}
                >
                  <p className="flex items-center"><FaWallet className="mr-3" /> Connect</p>
                </button>
              )
              : (
                <a
                  target="_blank"
                  href="https://metamask.io/"
                  className="bg-orange-600 shadow-xl rounded-2xl py-[9.5px] px-6 mr-6 text-white text-md"
                  rel="noreferrer"
                >
                  Install Metamask
                </a>
              )}
          </div>
        )}
      {showModal
        && (
          <div ref={modalRef} className="fixed inset-1/2 -translate-y-1/2 -translate-x-1/2 w-96 h-44 black-glassmorphism rounded-2xl border border-gray-700 z-20 text-white p-4">
            <h3>Account</h3>
            <p className="absolute right-3 top-2 text-3xl cursor-pointer" onClick={() => setShowModal(false)}>&times;</p>
            <div className="flex justify-between items-center mt-3 mb-2">
              <div className="flex items-center">
                <div ref={avatarRef} className="mt-[6px]" />
                <p className="ml-2 font-bold address-font text-2xl">{shortenAddress(address)}</p>
              </div>
              <button
                type="button"
                className="text-[0.825rem] text-rose-700 border border-rose-700 rounded-2xl px-2 py-[1px]"
                onClick={disconnect}
              >Disconnect
              </button>
            </div>
            <div className="mb-5 text-lg address-font">
              {formatBigNumber(balance, 7)} {activeNetwork.nativeCurrency.symbol}
            </div>
            <div className="flex text-sm">
              <p
                className="flex items-center mr-3 text-emerald-500 cursor-pointer hover:underline"
                onClick={() => {
                  navigator.clipboard.writeText(address);
                  setCopied(true);
                }}
              >
                {!copied ? (
                  <>
                    <MdOutlineContentCopy className="mr-1" /> Copy address
                  </>
                )
                  : (
                    <>
                      <TiTick className="mr-1" /> Copied!
                    </>
                  )}
              </p>
              {activeNetwork.blockExplorerUrls
                && (
                  <a
                    target="_blank"
                    href={`${activeNetwork.blockExplorerUrls[0]}/address/${address}`}
                    className="flex items-center hover:underline"
                    rel="noreferrer"
                  >
                    <HiOutlineExternalLink className="mr-1" />View on Exloprer
                  </a>
                )}
            </div>
          </div>
        )}
    </nav>
  );
};

export default Nav;
