import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { MdUploadFile } from 'react-icons/md';
import Loader from '../components/Loader';

const CreateNFT = ({ currency, ipfs, gateway, signer, getContract, setAccount, account }) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [data, setData] = useState({});
  const [reject, setReject] = useState(false);
  const router = useRouter();

  const handleChange = (text) => (e) => setData({ ...data, [text]: e.target.value });

  const uploadToIPFS = useCallback(async (file) => {
    try {
      const added = await ipfs.add({ content: file });
      const url = `${gateway}/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.log(error.message);
    }
  }, [gateway, ipfs]);

  const onDrop = useCallback(async (file) => {
    const url = await uploadToIPFS(file[0]);
    setFileUrl(url);
  }, [uploadToIPFS]);

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      'image/png': ['.png', '.jpeg', '.jpg', '.gif', '.svg'],
    },
    maxSize: 2 * 1024 * 1024,
    multiple: false,
    onDrop,
  });

  useEffect(() => {
    if (fileRejections) {
      const message = fileRejections[0]?.errors[0]?.message
        .replace('2097152 bytes', '2MB.')
        .replace('image/png,.png,.jpeg,.jpg,.gif,.svg', 'of type PNG, JPEG, JPG, GIF or SVG.');
      toast.info(message);
    }
  }, [fileRejections]);

  const createNFT = async () => {
    const { name, description, price } = data;
    if (!name || !description || !price || !fileUrl) {
      toast.warn('Please fill in all the fields');
      return 0;
    }

    const jsonData = JSON.stringify({ name, description, price, image: fileUrl });
    try {
      setReject(true);
      const added = await ipfs.add(jsonData);
      const url = `${gateway}/ipfs/${added.path}`;

      const formatPrice = ethers.utils.parseUnits(price, 'ether');
      const contract = await getContract(signer);
      const listingPrice = await contract.getListingPrice();

      const tx = await contract.createToken(url, formatPrice, { value: listingPrice });
      toast.info('Minting NFT. Please wait...');
      await tx.wait();

      const balance = await signer.getBalance();
      setAccount({ ...account, balance });
      router.push('/nfts');
      toast.success('NFT minted!');
    } catch (erorr) {
      console.log(erorr.message);
      setReject(false);
    }
  };

  return (
    <>
      <div className="bg-zinc-100 opacity-[7%] w-full h-[1px] mb-6" />
      <div className="flex w-4/5 mx-auto justify-center my-8 sm:px-4">
        <div className="tablet:w-4/5 w-full">
          <h1 className="text-slate-100 font-bold text-center mb-14 text-3xl">Create new NFT</h1>
          <div className="mt-12">
            <p className="text-white opacity-90 text-sm">Image</p>
            <div className="mt-2">
              <div {...getRootProps()} className="cursor-pointer white-glassmorphism  flex flex-col items-center p-10 rounded-3xl">
                <input {...getInputProps()} />
                <div className="text-center">
                  <div className="my-5 w-full flex justify-center">
                    {fileUrl
                      ? (
                        <img
                          src={fileUrl}
                          alt="asset_file"
                          width={250}
                          height={250}
                          className="object-contain rounded-xl shadow-xl"
                        />
                      )
                      : (
                        <MdUploadFile className="text-white h-28 w-28" />
                      )}
                  </div>
                  <p className="text-slate-200 text-base"><strong className="underline">Click to upload</strong> or drag and drop an image</p>
                  <p className="text-slate-200 mt-2 text-sm">JPG, PNG, GIF, SVG <strong>Max 2MB</strong></p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 w-full">
            <p className="text-white opacity-90 text-sm">Name</p>
            <input
              onChange={handleChange('name')}
              type="text"
              className="white-glassmorphism rounded-lg w-full outline-none text-white text-base mt-2 px-3 py-2"
              placeholder="My Awesome NFT"
            />
          </div>
          <div className="mt-7 w-full">
            <p className="text-white opacity-90 text-sm">Price</p>
            <div className="flex white-glassmorphism px-3 py-2 mt-2 rounded-lg">
              <input
                onChange={handleChange('price')}
                type="number"
                className="flex-1 bg-transparent outline-none text-white"
                placeholder="10"
              />
              <p className="text-slate-100">{currency}</p>
            </div>
            <small className="text-slate-300 text-xs">Creator fee: 0.01 {currency}</small>
          </div>
          <div className="mt-7">
            <p className="text-white opacity-90 text-sm">Description</p>
            <textarea
              onChange={handleChange('description')}
              rows={4}
              className="white-glassmorphism px-3 py-2 mt-2 rounded-lg resize-none w-full text-white outline-none"
            />
          </div>
          <div className="mt-7">
            <button
              onClick={createNFT}
              type="submit"
              className={`${reject ? 'cursor-not-allowed opacity-70' : 'hover:border-slate-600'} text-white black-glassmorphism px-3 py-[7px] rounded-lg float-right border border-transparent duration-300`}
            >
              {!reject ? 'Create' : <Loader size={5} message="Processing..." />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNFT;
