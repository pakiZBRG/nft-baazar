import React from 'react';
import Jazzicon from 'react-jazzicon';
import Link from 'next/link';

import { shortenAddress } from '../utils';

const CreatorCard = ({ creator, currency }) => (
  <Link href={`/nfts?id=${creator.seller}`}>
    <div className="black-glassmorphism px-6 rounded-lg py-8 m-2 text-white flex flex-col items-center border border-transparent hover:border-gray-700 duration-300 cursor-pointer">
      <Jazzicon diameter={60} seed={parseInt(creator.seller.slice(2, 10), 16)} />
      <p className="font-bold text-sm mt-4">{shortenAddress(creator.seller)}</p>
      <h1 className="text-[.8rem]">{creator.sum.toFixed(2)} {currency}</h1>
    </div>
  </Link>
);

export default CreatorCard;
