import React, { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { TiTick } from 'react-icons/ti';
import { FiSearch } from 'react-icons/fi';

const Filter = ({ nfts, setNfts, copyNfts }) => {
  const [filter, setFilter] = useState('Most recent');
  const [openFilter, setOpenFilter] = useState(false);
  const [search, setSearch] = useState('');

  const filterData = ['Most recent', 'Price: low to high', 'Price: high to low'];

  useEffect(() => {
    const sortedNfts = [...nfts];

    switch (filter) {
      case 'Most recent':
        setNfts(sortedNfts.sort((a, b) => b.createdAt - a.createdAt));
        break;
      case 'Price: low to high':
        setNfts(sortedNfts.sort((a, b) => a.price - b.price));
        break;
      case 'Price: high to low':
        setNfts(sortedNfts.sort((a, b) => b.price - a.price));
        break;
      default:
        break;
    }
  }, [filter]);

  const searchNfts = (e) => {
    const nftCopy = [...nfts];
    if (e !== '') {
      const filterNfts = nftCopy.filter((nft) => nft.name.toLowerCase().includes(e.toLowerCase()));
      setNfts(filterNfts);
    } else {
      setNfts(copyNfts);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => searchNfts(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="flex items-center">
      <label className="relative block mr-4 text-white">
        <FiSearch className="absolute left-[12px] top-[10px] z-10" />
        <input className="bg-transparent opacity-80 border border-transparent focus:border-slate-600 duration-300 rounded-lg black-glassmorphism w-72 text-sm outline-none py-[7.5px] pl-10" placeholder="Search NFTs" onChange={(e) => setSearch(e.target.value)} />
      </label>
      <div className="flex flex-col text-sm">
        <div className="relative black-glassmorphism py-[8px] px-4 rounded-lg text-slate-100 cursor-pointer active:scale-95 scale-100 duration-300" onClick={() => setOpenFilter((prevState) => !prevState)}>
          <p className="flex items-center opacity-80">
            {filterData.find((data) => data === filter)}
            <IoIosArrowDown className="ml-3" />
          </p>
        </div>
        {openFilter
          && (
            <div className="absolute mt-10 black-glassmorphism py-1 px-1 rounded-lg text-slate-100 w-48 z-20">
              {filterData.map((data) => <p key={data} className="py-2 px-3 opacity-80 flex justify-between cursor-pointer hover:bg-zinc-900 hover:opacity-70 rounded-lg" onClick={() => { setFilter(data); setOpenFilter(false); }}>{data} {data === filter && <TiTick />}</p>)}
            </div>
          )}
      </div>
    </div>
  );
};

export default Filter;
