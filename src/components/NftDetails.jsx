import { NftMarketplaceContext } from "@/context/NftMarketplaceContext";
import { ethers } from "ethers";
import { useState, useContext } from "react";
import LoadingScreen from "./LoadingScreen";
import { loader } from "@/assets";

const NftDetails = ({ selectedNft, setSelectedNft }) => {
  const { fetchContract, signer } = useContext(NftMarketplaceContext);
  const [price, setPrice] = useState(selectedNft.price);
  const [isLoading, setIsLoading] = useState(false);

  const listNft = async () => {
    try {
      setIsLoading(true);
      const tx = await fetchContract(11155111, signer).listNft(
        selectedNft.id,
        ethers.utils.parseEther(price)
      );
      const receipt = await tx.wait();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const cancelListing = async () => {
    try {
      setIsLoading(true);
      const tx = await fetchContract(11155111, signer).cancel;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="absolute top-0 w-full h-full flex items-center justify-center">
          {/* BACKGROUND */}
          <div
            className="absolute top-0 w-full h-full bg-slate-100 bg-opacity-70"
            onClick={() => setSelectedNft(null)}
          ></div>

          {/* BOX */}
          <div className="w-[300px] h-[500px] bg-white z-50 rounded-lg shadow-md p-4">
            <div className="h-2/3">
              <img src={selectedNft.uri} alt="" />
            </div>
            <div className="h-1/3 p-2 text-sm">
              <div className="flex gap-2">
                <p>id:</p>
                <p>{selectedNft.id}</p>
              </div>
              <div className="flex gap-2">
                <p>Owner:</p>
                <p>
                  {selectedNft.owner.slice(0, 4)}...
                  {selectedNft.owner.slice(-4)}
                </p>
              </div>
              <div className="flex gap-2">
                <p>Is listed: </p>
                <p>{selectedNft.isListed.toString()}</p>
              </div>
              <div className="flex gap-2">
                <p>Price: </p>
                <input
                  type="number"
                  className="border-2 rounded-md"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />{" "}
                ETH
              </div>

              <div className="flex w-full items-center justify-center gap-2 mt-5">
                <button
                  className="bg-blue-600 text-white font-bold rounded-lg p-1 w-28 disabled:bg-slate-300"
                  disabled={!selectedNft.isListed}
                >
                  Cancel Listing
                </button>
                <button
                  className="bg-blue-600 text-white font-bold rounded-lg p-1 w-28"
                  onClick={listNft}
                >
                  List NFT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NftDetails;
