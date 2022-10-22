import { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

import { Card, Loader, CreatorCard } from '../components';

const Home = ({ provider, signer, getContract, currency }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creators, setCreators] = useState([]);

  const fetchNFTs = useCallback(async () => {
    try {
      const contract = await getContract(provider);
      const marketItems = await contract.getMarketNFTs();
      const items = await Promise.all(marketItems.map(async (item) => {
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
          tokenURI,
        };
      }));

      setNfts(items);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  }, [getContract, provider]);

  const topCreators = useCallback(() => {
    const Creators = nfts.reduce((creator, nft) => {
      creator[nft.seller] = creator[nft.seller] || [];
      creator[nft.seller].push(nft);

      return creator;
    }, {});

    return Object.entries(Creators).map((creator) => {
      const seller = creator[0];
      const sum = creator[1].map((item) => +item.price).reduce((prev, curr) => prev + curr, 0);

      return ({ seller, sum });
    });
  }, [nfts]);

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  useEffect(() => {
    setCreators(topCreators());
  }, [topCreators]);

  return (
    <div>
      <div className="bg-zinc-100 opacity-[7%] w-full h-[1px] mb-6" />
      <h1 className="text-2xl text-slate-100 font-bold mb-8">Top Creators</h1>
      <div className="flex mx-5 overflow-x-auto">
        {!loading
          ? creators?.length
            ? creators.slice(0, 10).sort((a, b) => b.sum - a.sum).map((creator) => <CreatorCard key={creator.seller} creator={creator} currency={currency} />)
            : <h1 className="mx-auto text-slate-300 text-lg font-bold italic">No Creators</h1>
          : <div className="mx-auto"><Loader size={8} /></div>}
      </div>
      <h1 className="text-2xl text-slate-100 font-bold my-8">NFTs on sale!</h1>
      <div className="flex flex-wrap">
        {!loading
          ? nfts?.length
            ? nfts.map((nft) => <Card key={nft.tokenId} getContract={getContract} provider={provider} currency={currency} nft={nft} signer={signer} />)
            : <h1 className="mx-auto text-slate-300 text-lg font-bold italic">No NFTs For Sale</h1>
          : <div className="mx-auto"><Loader size={8} /></div>}
      </div>
    </div>
  );
};

export default Home;