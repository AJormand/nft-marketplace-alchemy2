import React, { useContext, useState } from "react";
import axios from "axios";
import FormData from "form-data";
import { NftMarketplaceContext } from "@/context/NftMarketplaceContext";

import LoadingScreen from "@/components/LoadingScreen";

const mintNft = () => {
  const { fetchContract, callContract, signer } = useContext(
    NftMarketplaceContext
  );
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const [attachedImageUrl, setAttachedImageUrl] = useState(null);
  const [formData, setformData] = useState(null);

  const mint = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const tokenURI = await uploadURItoPinata();
      const tx = await fetchContract(11155111, signer).mint(tokenURI);
      const receipt = await tx.wait();
      console.log(receipt);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  //In first step image is uploaded to ipfs and its url returned
  const uploadImageToPinata = async () => {
    const formData = new FormData();
    formData.append("file", attachedImage);
    const metadata = JSON.stringify({
      name: "File name",
    });
    formData.append("pinataMetadata", metadata);
    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
            pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
          },
        }
      );
      const imgHash = `ipfs://${res.data.IpfsHash}`;
      console.log("image uploaded: ", imgHash);
      return imgHash;
    } catch (error) {
      console.log(error);
    }
  };

  //In second step token metadata including image url returned from the first step is uploaded to ipfs
  const uploadURItoPinata = async () => {
    const imageUrl = await uploadImageToPinata();

    // var data = JSON.stringify({
    //   pinataOptions: {
    //     cidVersion: 1,
    //   },
    //   pinataMetadata: {
    //     name: formData.name,
    //     description: formData.description,
    //     image: imageUrl,
    //   },
    // });

    var data = {
      name: formData.name,
      description: formData.description,
      image: imageUrl,
    };

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data,
        {
          headers: {
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
            pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
          },
        }
      );
      const jsonHash = `ipfs://${res.data.IpfsHash}`;
      console.log("JSON URI uploaded: ", jsonHash);
      return jsonHash;
    } catch (error) {
      console.log(error);
    }
  };

  const handleAttachment = (e) => {
    const fileAttachment = e.target.files[0];
    setAttachedImage(fileAttachment);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setAttachedImageUrl(reader.result);
    });
    reader.readAsDataURL(fileAttachment);
  };

  const handleFormChange = (e) => {
    setformData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-14">Mint your NFT</h1>
      <form className="flex flex-col max-w-[400px] bg-slate-200 p-5 rounded-lg mt-5">
        <label htmlFor="name" className="font-semibold">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="my-2 p-1 rounded-lg"
          onChange={handleFormChange}
        />
        <label htmlFor="description" className="font-semibold">
          Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          className="my-2 p-1 rounded-lg"
          onChange={handleFormChange}
        />
        <label htmlFor="image" className="font-semibold">
          Image
        </label>
        <input
          type="file"
          accept="image/*"
          className="my-2 p-1"
          onChange={handleAttachment}
        />

        <div
          className={`h-[200px] flex items-center justify-center ${
            attachedImageUrl ? "block" : "hidden"
          }`}
        >
          <img src={attachedImageUrl} className="bg-cover h-full" />
        </div>

        <button
          className="bg-blue-600 rounded-full p-1 mt-10 font-bold text-white"
          onClick={(e) => mint(e)}
        >
          Mint NFT
        </button>
      </form>

      {/* Loading Screen */}
      {isLoading && <LoadingScreen />}
    </div>
  );
};

export default mintNft;
