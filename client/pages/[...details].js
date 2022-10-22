import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ImEnlarge2 } from 'react-icons/im';
import { ethers } from 'ethers';
import Jazzicon from 'react-jazzicon';
import { toast } from 'react-toastify';

import Link from 'next/link';
import { shortenAddress } from '../utils';
import { Loader, SellModal } from '../components';

const NftDetails = ({ account, getContract, provider, currency, showSellModal, setShowSellModal, signer, openImage, setOpenImage, getInterface }) => {
  const [nft, setNft] = useState({});
  const [price, setPrice] = useState(0);
  const [reject, setReject] = useState(false);
  const [events, setEvents] = useState([]);
  const [tabs, setTabs] = useState('Details');
  const router = useRouter();
  const modalRef = useRef();
  const heightRef = useRef();

  const getEvents = useCallback(async () => {
    try {
      const contract = await getContract(provider);
      const toBlock = await provider.getBlockNumber();
      const logData = await provider.getLogs({
        fromBlock: 0,
        toBlock,
        address: contract.address,
      });
      const iface = getInterface();
      const allLogs = logData.map((log) => iface.parseLog(log));
      const nftLogs = allLogs.filter((log) => log.name === 'MarketItemBought' && log.args.tokenId.toNumber() === nft.tokenId);
      const formatLogs = nftLogs.map((log) => ({
        buyer: log.args.buyer,
        price: ethers.utils.formatEther(log.args.price),
      }));
      setEvents(formatLogs);
    } catch (error) {
      console.log(error.message);
    }
  }, [provider, getContract, getInterface, nft.tokenId]);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  useEffect(() => {
    const closeModal = (e) => setShowSellModal(modalRef?.current?.contains(e.target));
    document.addEventListener('mousedown', closeModal);
    return () => document.removeEventListener('mousedown', closeModal);
  }, [setShowSellModal]);

  const getNftDetails = useCallback(async () => {
    try {
      if (router.query.details) {
        const id = router.query.details[2];
        const contract = await getContract(provider);
        const token = await contract.getMarketItem(id);
        const tokenURI = await contract.tokenURI(id);
        const { data } = await axios.get(tokenURI);
        const item = {
          ...data,
          tokenId: token.tokenId.toNumber(),
          owner: token.owner,
          price: ethers.utils.formatUnits(token.price, 'ether'),
          seller: token.seller,
          isSelling: token.isSelling,
          createdAt: token.createdAt.toNumber(),
          creator: token.creator,
        };

        setPrice(item.price);
        setNft(item);
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [getContract, provider, router.query.details]);

  useEffect(() => {
    getNftDetails();
  }, [getNftDetails]);

  const putNftOnSale = async () => {
    if (+price < nft.price) {
      toast.info(`Please, input the price greater or equal than ${nft.price}`);
      return 0;
    }

    try {
      setReject(true);
      const contract = await getContract(signer);
      const listingPrice = await contract.getListingPrice();
      const formatPrice = ethers.utils.parseUnits(price, 'ether');
      const tx = await contract.putTokenOnSale(nft.tokenId, formatPrice, { value: listingPrice.toString() });
      await tx.wait();
      toast.success(`NFT is put on sale for ${nft.price} ${currency}`);
      setReject(false);
      setShowSellModal(false);
    } catch (error) {
      console.log(error.message);
      setReject(false);
    }
  };

  const removeNftFromSale = async () => {
    try {
      setReject(true);
      const contract = await getContract(signer);
      const tx = await contract.removeTokenFromMarket(nft.tokenId);
      await tx.wait();
      toast.success('NFT is removed from sale!');
      setReject(false);
      setShowSellModal(false);
    } catch (error) {
      console.log(error.message);
      setReject(false);
    }
  };

  const buyNFT = async () => {
    try {
      setReject(true);
      const contract = await getContract(signer);
      const formatPrice = ethers.utils.parseEther(price);
      const tx = await contract.purchaseToken(nft.tokenId, { value: formatPrice });
      await tx.wait();
      toast.success(`${nft.name} is bought for ${nft.price} ${currency}!`);
      setReject(false);
    } catch (error) {
      console.log(error.message);
      setReject(false);
    }
  };

  console.log(nft);

  const isCreator = nft.creator?.toLowerCase() === account.address.toLowerCase() || nft.seller === '0x0000000000000000000000000000000000000000' || nft.seller?.toLowerCase() === account.address.toLowerCase();

  return (
    <>
      {openImage
        && (
          <div>
            <span className="z-20 text-white text-7xl cursor-pointer top-[10px] right-[10px] absolute" onClick={() => setOpenImage(false)}>&times;</span>
            <img src={nft.image} className="z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 object-contain" />
          </div>
        )}
      <div className="bg-zinc-100 opacity-[7%] w-full h-[1px] mb-10" />
      <div className="flex items-center" ref={heightRef}>
        <div className="flex-1">
          <div className="group relative mx-12 my-4">
            <img src={nft.image} className="rounded-lg shadow-2xl max-h-[550px] mx-auto" />
            <div className="cursor-pointer group-hover:opacity-100 duration-300 opacity-0 absolute top-0 rounded-lg w-full h-full bg-black/50" onClick={() => setOpenImage(true)}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <p className="text-slate-200 text-xl mb-4">Enlarge Image</p>
                <ImEnlarge2 className="text-4xl text-slate-200" />
              </div>
            </div>
          </div>
        </div>
        <div className="h-min w-[1px] bg-zinc-300" />
        <div className="bg-zinc-100 opacity-[7%] h-[510px] w-[1px]" />
        <div className="flex-1 text-slate-100">
          <div className="mx-12 my-4">
            <h1 className="font-bold text-2xl">{nft.name}</h1>
            <p className="mb-9 text-xs text-slate-500">Created: {new Date(nft.createdAt * 1000).toLocaleString().substring(0, 17)}</p>
            <div className="flex justify-between">
              <div>
                <small className="text-zinc-100 opacity-40">Creator</small>
                <div className="flex mt-1 items-center">
                  <Jazzicon diameter={30} seed={parseInt(nft.creator?.slice(2, 10), 16)} />
                  <p className="text-sm ml-3 font-bold">{shortenAddress(nft.creator)}</p>
                </div>
              </div>
              {nft.seller !== '0x0000000000000000000000000000000000000000'
                && (
                  <div>
                    <small className="text-zinc-100 opacity-40">Seller</small>
                    <div className="flex mt-1 items-center">
                      <Jazzicon diameter={30} seed={parseInt(nft.seller?.slice(2, 10), 16)} />
                      <p className="text-sm ml-3 font-bold">{shortenAddress(nft.seller)}</p>
                    </div>
                  </div>
                )}
            </div>
            <div className="mt-8 flex flex-col items-end">
              <small className="text-zinc-100 opacity-40">Price</small>
              <h1 className="font-bold">
                <span className="text-xl">{nft.price} </span>
                <span className="text-md">{currency}</span>
              </h1>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <p className={`${tabs === 'Details' && 'font-bold opacity-60'}text-zinc-100 text-sm opacity-40 cursor-pointer`} onClick={() => setTabs('Details')}>Details</p>
                <div className="h-5 w-[1px] mx-4 bg-zinc-100 opacity-10" />
                <p className={`${tabs === 'History' && 'font-bold opacity-60'} text-zinc-100 text-sm opacity-40 cursor-pointer`} onClick={() => setTabs('History')}>History</p>
              </div>
              <div className="bg-zinc-100 opacity-10 w-full h-[1px] my-2" />
              {tabs === 'Details'
                ? <div className="p-1 h-40 overflow-y-auto">{nft.description}</div>
                : (
                  <div className="p-1 h-40 overflow-y-auto">
                    {events?.map(({ buyer, price: expe }) => (
                      <>
                        <div className="flex justify-between items-center p-1 m-1">
                          <div className="flex items-center">
                            <Jazzicon diameter={15} seed={parseInt(buyer.slice(2, 10), 16)} />
                            <Link href={`/nfts?id=${buyer}`} passHref>
                              <p className="cursor-pointer hover:underline text-sm text-zinc-100 opacity-50 ml-2">{shortenAddress(buyer.toLowerCase())}
                              </p>
                            </Link>
                          </div>
                          <div className="flex items-center">
                            <p>{expe}</p>
                            <p className="text-xs ml-1 text-zinc-100 opacity-50">{currency}</p>
                          </div>
                        </div>
                        <div className="w-full h-[1px] bg-zinc-100 opacity-10" />
                      </>
                    ))}
                  </div>
                )}
            </div>
            <div className="mt-8">
              {!isCreator
                && (
                  <button
                    type="button"
                    className={`${reject ? 'cursor-not-allowed opacity-70' : 'hover:border-slate-500'} marker:cursor-pointer white-glassmorphism px-5 py-[6px] text-slate-100 rounded-lg hover:shadow-zinc-900/40 border border-transparent duration-300 shadow-lg mr-5`}
                    onClick={buyNFT}
                  >
                    {!reject ? 'Buy' : <Loader size={5} message="Processing..." />}
                  </button>
                )}
              {
                isCreator && !nft.isSelling
                  ? (
                    <button
                      type="button"
                      className="white-glassmorphism px-5 py-[6px] text-slate-100 rounded-lg hover:shadow-zinc-900/40 shadow-lg border border-transparent hover:border-slate-500 duration-300"
                      onClick={() => setShowSellModal(true)}
                    >
                      Put on Sale
                    </button>
                  )
                  : (
                    <button
                      type="button"
                      className="white-glassmorphism px-5 py-[6px] text-slate-100 rounded-lg hover:shadow-zinc-900/40 shadow-lg border border-transparent hover:border-slate-500 duration-300"
                      onClick={() => setShowSellModal(true)}
                    >
                      Remove from Market
                    </button>
                  )
              }
            </div>
          </div>
        </div>
      </div>
      {
        showSellModal
        && (
          <SellModal
            nft={nft}
            price={price}
            setPrice={setPrice}
            currency={currency}
            modalRef={modalRef}
            putNftOnSale={putNftOnSale}
            reject={reject}
            setShowSellModal={setShowSellModal}
            removeNftFromSale={removeNftFromSale}
          />
        )
      }
    </>
  );
};

export default NftDetails;
