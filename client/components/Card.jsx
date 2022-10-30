import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { shortenAddress } from '../utils';

const Card = ({ myNFT, nft, currency }) => (
  <Link href={`/details/${nft.creator}/${nft.tokenId}`}>
    <div className="w-72 rounded-lg m-4 cursor-pointer shadow-lg group">
      <div className="relative w-full h-60 rounded-tl-lg rounded-tr-lg overflow-hidden">
        {nft.isSelling && (
          <div className="relative z-20 -left-24 -top-24 rotate-45 bg-rose-600/70 w-40 h-40 text-white font-bold">
            <span className="absolute top-[72px] -right-5 -rotate-90">On Sale</span>
          </div>
        )}
        <Image
          className="group-hover:scale-110 duration-700 ease-out"
          src={nft.image}
          layout="fill"
          objectFit="cover"
          alt={`nft-${nft.i}`}
        />
      </div>
      <div className="py-2 px-3 flex flex-col text-slate-100 black-glassmorphism rounded-bl-lg rounded-br-lg">
        {!myNFT
          ? (
            <>
              <div className="flex justify-between">
                <p className="font-semibold">{nft.name.length > 28 ? `${nft.name.slice(0, 28)}...` : nft.name}</p>
              </div>
              <div className="flex mt-1 flex-row">
                <div className="flex-1 py-1">
                  <small className="text-slate-400">Price</small>
                  <p className="font-semibold text-sm">{nft.price} <span className="text-xs">{currency}</span></p>
                </div>
                <div className="flex-1 py-1">
                  <small className="text-slate-400">Creator</small>
                  <p className="font-semibold text-sm">{shortenAddress(nft.creator)}</p>
                </div>
              </div>
            </>
          )
          : (
            <div className="flex items-center justify-between">
              <div className="font-semibold">{nft.name.length > 17 ? `${nft.name.slice(0, 17)}...` : nft.name}</div>
              <div>
                <small className="text-slate-400">Price</small>
                <p className="font-semibold text-sm">{nft.price} <span className="text-xs">{currency}</span></p>
              </div>
            </div>
          )}
      </div>
    </div>
  </Link>
);

export default Card;
