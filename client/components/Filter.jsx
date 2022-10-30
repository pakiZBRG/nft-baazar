import React, { useEffect, useState, useCallback, useRef } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { TiTick } from 'react-icons/ti';
import { FiSearch } from 'react-icons/fi';
import { useRouter } from 'next/router';

const Filter = ({ nfts, setNfts, copyNfts }) => {
  const router = useRouter();
  const [filter, setFilter] = useState('Most recent');
  const [openFilter, setOpenFilter] = useState(false);
  const [search, setSearch] = useState('');
  const filterRef = useRef();

  const filterData = ['Most recent', 'Price: low to high', 'Price: high to low', router.pathname === '/nfts' && 'On Sale'];

  useEffect(() => {
    const closeModal = (e) => !filterRef?.current?.contains(e.target) && setOpenFilter(false);
    document.addEventListener('mousedown', closeModal);
    return () => document.removeEventListener('mousedown', closeModal);
  }, []);

  const filterNfts = useCallback(() => {
    const sortedNfts = [...nfts];
    const copiedNfts = [...copyNfts];

    switch (filter) {
      case 'Most recent':
        setNfts(copiedNfts.sort((a, b) => b.createdAt - a.createdAt));
        break;
      case 'Price: low to high':
        setNfts(copiedNfts.sort((a, b) => a.price - b.price));
        break;
      case 'Price: high to low':
        setNfts(copiedNfts.sort((a, b) => b.price - a.price));
        break;
      case 'On Sale':
        setNfts(sortedNfts.filter((nft) => nft.isSelling));
        break;
      default:
        break;
    }
  }, [filter, setNfts, copyNfts]);

  useEffect(() => {
    filterNfts();
  }, [filterNfts]);

  const searchNfts = useCallback((e) => {
    const nftCopy = [...nfts];
    if (e !== '') {
      const searched = nftCopy.filter((nft) => nft.name.toLowerCase().includes(e.toLowerCase()));
      setNfts(searched);
    } else {
      setFilter('Most recent');
      setNfts(copyNfts);
    }
  }, [setNfts, copyNfts]);

  useEffect(() => {
    const timer = setTimeout(() => searchNfts(search), 500);
    return () => clearTimeout(timer);
  }, [search, searchNfts]);

  return (
    <div className="flex justify-end mb-8 select-none">
      <label className="relative block mr-4 text-white">
        <FiSearch className="absolute left-[12px] top-[11px] z-10" />
        <input className="bg-transparent opacity-80 border border-transparent focus:border-slate-600 duration-300 rounded-lg black-glassmorphism w-72 text-sm outline-none py-[7.5px] pl-10" placeholder="Search NFTs" onChange={(e) => setSearch(e.target.value)} />
      </label>
      <div ref={filterRef} className="flex flex-col text-sm">
        <div className="relative black-glassmorphism py-[8px] px-4 rounded-lg text-slate-100 cursor-pointer active:scale-95 w-48 scale-100 duration-300" onClick={() => setOpenFilter((prevState) => !prevState)}>
          <p className="flex items-center opacity-80 justify-between">
            {filterData.find((data) => data === filter)}
            <IoIosArrowDown className="ml-3" />
          </p>
        </div>
        {openFilter
          && (
            <div className="absolute mt-10 black-glassmorphism py-1 px-1 rounded-lg text-slate-100 w-48 z-20">
              {filterData.map((data) => <p key={data} className={`${data && 'py-2 px-3'} opacity-80 flex justify-between cursor-pointer hover:bg-zinc-900 hover:opacity-70 rounded-lg`} onClick={() => { setFilter(data); setOpenFilter(false); }}>{data} {data === filter && <TiTick />}</p>)}
            </div>
          )}
      </div>
    </div>
  );
};

export default Filter;
