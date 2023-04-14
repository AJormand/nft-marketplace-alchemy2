import React, { useContext, useState } from "react";
import { NftMarketplaceContext } from "@/context/NftMarketplaceContext";

import LoadingScreen from "@/components/LoadingScreen";

const mintNft = () => {
  const { fetchContract, callContract, signer } = useContext(
    NftMarketplaceContext
  );
  const [isLoading, setIsLoading] = useState(false);

  const mint = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const tokenURI =
      "https://gateway.pinata.cloud/ipfs/QmUPjADFGEKmfohdTaNcWhp7VGk26h5jXDA7v3VtTnTLcW?_gl=1*17z63ia*rs_ga*YzAyNTc2NmUtZDAwNC00M2JiLTk4ODEtYzg3NzhjMDkwYzgz*rs_ga_5RMPXG14TE*MTY4MTE1MTAwNi4xLjEuMTY4MTE1MTAxNy40OS4wLjA.";
    const tx = await fetchContract(11155111, signer).mint(tokenURI);
    const receipt = await tx.wait();
    console.log(receipt);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-14">Mint your NFT</h1>
      <form className="flex flex-col max-w-[400px] bg-slate-200 p-5 rounded-lg mt-5">
        <label htmlFor="name" className="font-semibold">
          Name
        </label>
        <input type="text" id="name" className="my-2 p-1 rounded-lg" />
        <label htmlFor="description" className="font-semibold">
          Description
        </label>
        <input type="text" id="description" className="my-2 p-1 rounded-lg" />
        <label htmlFor="image" className="font-semibold">
          Image
        </label>
        <input type="file" accept="image/*" className="my-2 p-1" />

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
