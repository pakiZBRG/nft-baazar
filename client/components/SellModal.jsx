import React from 'react';
import Loader from './Loader';

const SellModal = ({ modalRef, nft, price, currency, setPrice, putNftOnSale, reject, setShowSellModal, removeNftFromSale }) => (
  <div ref={modalRef} className="fixed flex flex-col items-center inset-1/2 -translate-y-1/2 -translate-x-1/2 w-96 h-max black-glassmorphism rounded-xl border border-gray-700 z-30 text-white p-4 px-6">
    <h3 className="font-bold text-lg text-center">{nft.isSelling ? 'Are you sure you want to remove NFT from the open market?' : 'Put NFT on Sale'}</h3>
    {!nft.isSelling
      && (
        <>
          <img src={nft.image} className="mt-6 rounded-lg" />
          <div className="flex white-glassmorphism px-2 p-1 w-full mt-2 rounded-lg">
            <input
              type="number"
              className="flex-1 bg-transparent outline-none text-white"
              defaultValue={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <p className="text-slate-100">{currency}</p>
          </div>
          <small className="text-slate-300 flex self-start text-xs mb-7 mt-1">Creator fee:<b className="ml-1">0.01 {currency}</b></small>
        </>
      )}
    {nft.isSelling
      ? (
        <div className="mt-7">
          <button
            type="button"
            className="mr-7 text-slate-100"
            onClick={() => setShowSellModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`${reject ? 'cursor-not-allowed opacity-70' : 'hover:border-slate-500'} white-glassmorphism ml-5 px-5 py-[7px] text-slate-100 rounded-lg hover:shadow-zinc-900/40 duration-300 shadow-lg border border-transparent`}
            onClick={removeNftFromSale}
            disabled={reject}
          >
            {!reject ? 'Remove' : <Loader size={5} message="Processing..." />}
          </button>
        </div>
      )
      : (
        <button
          type="button"
          className={`${reject ? 'cursor-not-allowed opacity-70' : 'hover:border-slate-500'} white-glassmorphism ml-5 px-5 py-[7px] text-slate-100 rounded-lg hover:shadow-zinc-900/40 duration-300 shadow-lg border border-transparent`}
          onClick={putNftOnSale}
          disabled={reject}
        >
          {!reject ? 'Sale' : <Loader size={5} message="Processing..." />}
        </button>
      )}
  </div>
);

export default SellModal;
