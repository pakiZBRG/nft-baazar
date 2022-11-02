/* eslint-disable jsx-a11y/anchor-is-valid */
import { useRef, useEffect, useState } from 'react';
import { FaWallet } from 'react-icons/fa';
import Link from 'next/link';
import { RiErrorWarningLine } from 'react-icons/ri';
import { MdKeyboardArrowDown, MdOutlineContentCopy } from 'react-icons/md';
import { TiTick } from 'react-icons/ti';
import { HiOutlineExternalLink } from 'react-icons/hi';
import Jazzicon from 'react-jazzicon';

import { formatBigNumber, networks, shortenAddress } from '../utils';
import MobileNav from './MobileNav';

const Nav = ({ account, installMetamask, connectWallet, switchNetwork, chainId, setChainId, setShowModal, showModal, isLoggedIn, currency, deployedNetworks, setOpenNavbar, openNavbar }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState({});
  const [copied, setCopied] = useState(false);
  const modalRef = useRef();
  const { address, balance } = account;

  // close modal when clicking outside of it
  useEffect(() => {
    const closeModal = (e) => setShowModal(modalRef?.current?.contains(e.target));
    document.addEventListener('mousedown', closeModal);
    return () => document.removeEventListener('mousedown', closeModal);
  }, [setShowModal]);

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
          console.log(addError.message);
        }
      }
      console.log(error.message);
    }
  };

  return (
    <nav className="flex justify-between items-center m-5">
      <div className="flex cursor-pointer">
        <Link href="/">
          <img src="/public/eth-colored.png" className="h-8" />
        </Link>
      </div>
      <div className="tablet:flex hidden">
        <ul className="flex items-center">
          <li className="mx-4 text-md font-semibold text-slate-100">
            <Link href="/">Explore</Link>
          </li>
          {isLoggedIn
            && (
              <>
                <li className="mx-4 text-md font-semibold text-slate-100">
                  <Link href="/nfts">My NFTs</Link>
                </li>
                <li className="mx-4 text-md font-semibold">
                  <Link href="/create" passHref>
                    <a className="white-glassmorphism px-6 py-[8.5px] text-slate-100 rounded-xl hover:shadow-zinc-900/40 border border-transparent hover:border-slate-500 duration-300 shadow-lg">Create</a>
                  </Link>
                </li>
              </>
            )}
        </ul>
        {isLoggedIn
          ? (
            !switchNetwork
              ? (
                <>
                  <div className="relative">
                    <div
                      className="flex items-center black-glassmorphism text-white px-3 py-[7px] mx-3 rounded-xl cursor-default"
                      onMouseEnter={() => setShowDialog(true)}
                      onMouseLeave={() => setShowDialog(false)}
                    >
                      {activeNetwork?.iconUrls
                        && <img src={activeNetwork.iconUrls[1]} alt="logo" width="20" height="20" className="mr-2" />}
                      {activeNetwork.chainName}
                    </div>
                    {showDialog
                      && (
                        <>
                          <div
                            className="absolute w-56 top-[35px] h-3 display-none"
                            onMouseEnter={() => setShowDialog(true)}
                            onMouseLeave={() => setShowDialog(false)}
                          />
                          <div
                            className="absolute top-[45px] w-[220px] px-4 py-3 rounded-xl black-glassmorphism z-20"
                            onMouseEnter={() => setShowDialog(true)}
                            onMouseLeave={() => setShowDialog(false)}
                          >
                            <p className="text-sm text-slate-200 mb-3">Select a network</p>
                            {networks.filter((net) => deployedNetworks.includes(parseInt(net.chainId, 16).toString())).map((chain) => (
                              <div
                                onClick={() => changeNetwork(chain.chainName)}
                                className={`flex justify-between items-center p-1 mb-1 cursor-${chain.chainId !== chainId ? 'pointer hover:bg-zinc-800 duration-150 rounded-md' : 'default'}`}
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
                  </div>
                  <div className="text-sm text-white px-[2px] py-[2px] black-glassmorphism rounded-xl flex items-center">
                    <p className="font-bold text-base mx-3 address-font">{formatBigNumber(balance, 3)}</p>
                    <div className="flex items-center py-1 white-glassmorphism px-3 rounded-[11px] cursor-pointer border border-transparent hover:border-slate-600 duration-300" onClick={() => setShowModal(true)}>
                      <p className="mr-2 font-bold text-base address-font">{shortenAddress(address)}</p>
                      <Jazzicon diameter={20} seed={parseInt(account.address.slice(2, 10), 16)} />
                    </div>
                  </div>
                </>
              )
              : (
                <div>
                  <div
                    className="flex items-center bg-rose-600 text-white px-5 py-[7px] mx-5 rounded-xl cursor-default shadow-lg"
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
                          className="absolute w-56 right-[40px] h-1 opacity-10"
                          onMouseEnter={() => setShowDialog(true)}
                          onMouseLeave={() => setShowDialog(false)}
                        />
                        <div
                          className="absolute right-[20px] top-[62px] w-[250px] px-4 py-3 rounded-xl black-glassmorphism z-20"
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
            <div className="flex">
              {!installMetamask
                ? (
                  <button
                    type="button"
                    className="py-[6px] px-6 mx-4 rounded-xl text-white bg-sky-700 hover:shadow-sky-900/40 border border-transparent hover:border-sky-600 duration-300 shadow-xl"
                    onClick={connectWallet}
                  >
                    <p className="flex items-center"><FaWallet className="mr-3" /> Connect</p>
                  </button>
                )
                : (
                  <a
                    target="_blank"
                    href="https://metamask.io/"
                    className="bg-orange-600 hover:shadow-orange-900/40 shadow-xl rounded-xl py-[6px] px-6 mr-6 text-white border border-transparent hover:border-orange-400 duration-300"
                    rel="noreferrer"
                  >
                    Install Metamask
                  </a>
                )}
            </div>
          )}
      </div>

      {openNavbar
        ? (
          <MobileNav
            setOpenNavbar={setOpenNavbar}
            isLoggedIn={isLoggedIn}
            switchNetwork={switchNetwork}
            showDialog={showDialog}
            setShowDialog={setShowDialog}
            activeNetwork={activeNetwork}
            networks={networks}
            deployedNetworks={deployedNetworks}
            chainId={chainId}
            showModal={showModal}
            setShowModal={setShowModal}
            installMetamask={installMetamask}
            connectWallet={connectWallet}
            changeNetwork={changeNetwork}
            account={account}
          />
        )
        : (
          <div className="tablet:hidden block">
            <div className="cursor-pointer z-20" onClick={() => setOpenNavbar((prevState) => !prevState)}>
              <div className="h-[3px] w-10 bg-white opacity-40" />
              <div className="h-[3px] w-10 bg-white opacity-40 mt-2" />
              <div className="h-[3px] w-10 bg-white opacity-40 mt-2" />
            </div>
          </div>
        )}

      {showModal
        && (
          <div ref={modalRef} className="fixed inset-1/2 -translate-y-1/2 -translate-x-1/2 w-96 h-44 black-glassmorphism rounded-xl border border-gray-700 z-30 text-white p-4">
            <h3>Account</h3>
            <p className="absolute right-3 top-2 text-3xl cursor-pointer" onClick={() => setShowModal(false)}>&times;</p>
            <div className="mt-3 mb-2">
              <div className="flex items-center">
                <Jazzicon diameter={30} seed={parseInt(account.address.slice(2, 10), 16)} />
                <p className="ml-2 font-bold address-font text-2xl">{shortenAddress(address)}</p>
              </div>
            </div>
            <div className="mb-5 text-lg address-font">
              {formatBigNumber(balance, 7)} {currency}
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
                    <HiOutlineExternalLink className="mr-1" />View on Explorer
                  </a>
                )}
            </div>
          </div>
        )}
    </nav>
  );
};

export default Nav;
