import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';

import { Card, Filter, Loader } from '../components';

const MyNft = ({ getContract, signer, currency, account }) => {
  const router = useRouter();
  const userId = router.query.id;
  const [myNfts, setMyNfts] = useState([]);
  const [myCopyNfts, setMyCopyNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getNfts = useCallback(async () => {
    try {
      const contract = await getContract(signer);
      const myItems = await contract.getPersonsNFTs(userId || account.address);
      const items = await Promise.all(myItems.map(async (item) => {
        const tokenURI = await contract.tokenURI(item.tokenId);
        const { data } = await axios.get(tokenURI);
        const price = ethers.utils.formatUnits(item.price.toString(), 'ether');

        return {
          ...data,
          price,
          tokenId: item.tokenId.toNumber(),
          seller: item.seller,
          owner: item.owner,
          creator: item.creator,
          isSelling: item.isSelling,
          tokenURI,
        };
      }));

      setMyNfts(items);
      setMyCopyNfts(items);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  }, [getContract, account.address, signer, userId]);

  useEffect(() => {
    getNfts();
  }, [getNfts]);

  return (
    <div>
      <div className="bg-zinc-100 opacity-[7%] w-full h-[1px] mb-6" />
      <div className="flex items-center justify-between my-9">
        <h1 className="text-2xl text-slate-100 font-bold">My Nfts</h1>
        <Filter nfts={myNfts} setNfts={setMyNfts} copyNfts={myCopyNfts} />
      </div>
      <div className="flex flex-wrap">
        {!loading
          ? myCopyNfts?.length
            ? myCopyNfts?.map((nft) => <Card myNFT key={nft.tokenId} currency={currency} nft={nft} />)
            : <h1 className="my-10 mx-auto text-slate-300 text-lg font-bold italic">No NFTs</h1>
          : <div className="mx-auto"><Loader size={8} /></div>}
      </div>
    </div>
  );
};

export default MyNft;
