/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import React from 'react';
import { FaWallet } from 'react-icons/fa';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { RiErrorWarningLine } from 'react-icons/ri';
import Jazzicon from 'react-jazzicon';

import { formatBigNumber, shortenAddress } from '../utils';

const MobileNav = ({ showModal, setOpenNavbar, isLoggedIn, switchNetwork, showDialog, setShowDialog, activeNetwork, networks, deployedNetworks, chainId, setShowModal, installMetamask, connectWallet, changeNetwork, account }) => (
  <div className="z-40 tablet:hidden block">
    {!showModal
      && (
        <>
          <p onClick={() => setOpenNavbar(false)} className="fixed cursor-pointer top-1 right-3 text-white text-6xl">&times;</p>
          <ul className="fixed tablet:hidden flex flex-col items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-semibold">
            <li className="my-4 text-slate-100" onClick={() => setOpenNavbar(false)}>
              <Link href="/">Explore</Link>
            </li>
            {isLoggedIn
              && (
                <>
                  <li className="my-4 text-slate-100" onClick={() => setOpenNavbar(false)}>
                    <Link href="/nfts">My NFTs</Link>
                  </li>
                  <li className="my-4" onClick={() => setOpenNavbar(false)}>
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
                  <div className="fixed flex flex-row bottom-5 right-3">
                    <div className="relative">
                      <div
                        className="flex items-center white-glassmorphism text-slate-200 px-3 py-[7px] mx-3 rounded-xl cursor-default"
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
                              className="absolute w-32 left-4 -top-2 h-2 display-none"
                              onMouseEnter={() => setShowDialog(true)}
                              onMouseLeave={() => setShowDialog(false)}
                            />
                            <div
                              className="absolute top-[-95px] w-[220px] px-4 py-3 rounded-xl white-glassmorphism z-20"
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
                    </div>
                    <div className="text-sm text-white px-[2px] py-[2px] white-glassmorphism rounded-xl flex items-center">
                      <p className="font-bold text-base mx-3 address-font">{formatBigNumber(account.balance, 3)}</p>
                      <div className="flex items-center py-1 white-glassmorphism px-3 rounded-[11px] cursor-pointer border border-transparent hover:border-slate-600 duration-300" onClick={() => setShowModal(true)}>
                        <p className="mr-2 font-bold text-base address-font">{shortenAddress(account.address)}</p>
                        <Jazzicon diameter={20} seed={parseInt(account.address.slice(2, 10), 16)} />
                      </div>
                    </div>
                  </div>
                )
                : (
                  <div>
                    <div
                      className="absolute bottom-5 right-0 flex items-center bg-rose-600 text-white px-5 py-[7px] mx-5 rounded-xl cursor-default shadow-lg"
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
                            className="absolute w-56 bottom-[57px] right-6 h-2 display-none"
                            onMouseEnter={() => setShowDialog(true)}
                            onMouseLeave={() => setShowDialog(false)}
                          />
                          <div
                            className="absolute right-[25px] bottom-16 w-[260px] px-4 py-3 rounded-xl white-glassmorphism"
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
                      className="absolute bottom-5 right-0 py-[6px] px-6 mx-4 rounded-xl text-white bg-sky-700 hover:shadow-sky-900/40 border border-transparent hover:border-sky-600 duration-300 shadow-xl"
                      onClick={connectWallet}
                    >
                      <p className="flex items-center"><FaWallet className="mr-3" /> Connect</p>
                    </button>
                  )
                  : (
                    <a
                      target="_blank"
                      href="https://metamask.io/"
                      className="absolute bottom-5 right-0 bg-orange-600 hover:shadow-orange-900/40 shadow-xl rounded-xl py-[6px] px-6 mr-6 text-whiteduration-300"
                      rel="noreferrer"
                    >
                      Install Metamask
                    </a>
                  )}
              </div>
            )}
        </>
      )}
  </div>
);

export default MobileNav;
