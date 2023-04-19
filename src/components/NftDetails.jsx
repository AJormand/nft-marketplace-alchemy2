import { NftMarketplaceContext } from "@/context/NftMarketplaceContext";
import { ethers } from "ethers";
import { useState, useContext } from "react";
import LoadingScreen from "./LoadingScreen";
import { loader } from "@/assets";

const NftDetails = ({ selectedNft, setSelectedNft }) => {
  const { fetchContract, signer, currentAccount } = useContext(
    NftMarketplaceContext
  );
  const [price, setPrice] = useState(selectedNft.price);
  const [isLoading, setIsLoading] = useState(false);

  //console.log(signer.address);

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
      const tx = await fetchContract(11155111, signer).cancelListing(
        selectedNft.id
      );
      const receipt = await tx.wait();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const buyNft = async () => {
    try {
      setIsLoading(true);
      const tx = await fetchContract(11155111, signer).buyNft(selectedNft.id, {
        value: ethers.utils.parseEther(selectedNft.price),
      });
      const receipt = await tx.wait();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="fixed top-0 bottom-0 w-full h-full flex items-center justify-center">
          {/* BACKGROUND */}
          <div
            className="absolute top-0 w-full h-full bg-slate-100 bg-opacity-70"
            onClick={() => setSelectedNft(null)}
          ></div>

          {/* BOX */}
          <div className="w-[400px] h-[600px] bg-white z-50 rounded-lg shadow-md p-4">
            <div className="h-1/2 flex items-center justify-center">
              <img
                src={selectedNft.image}
                className="max-h-full rounded-md"
                alt=""
              />
            </div>
            <div className="h-1/2 p-2 text-sm">
              <div className="flex gap-2">
                <p>id:</p>
                <p>{selectedNft.id}</p>
              </div>
              <div className="flex gap-2">
                <p>name:</p>
                <p>{selectedNft.name}</p>
              </div>
              <div className="flex flex-col">
                <p>Description:</p>
                <p className="text-xs text-gray-400">
                  {selectedNft.description}
                </p>
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
                  disabled={selectedNft.isListed}
                />{" "}
                ETH
              </div>

              <div className="flex w-full items-center justify-center gap-2 mt-5">
                {selectedNft.owner == currentAccount ? (
                  <>
                    <button
                      className="bg-blue-600 text-white font-bold rounded-lg p-1 w-28 disabled:bg-slate-300"
                      disabled={!selectedNft.isListed}
                      onClick={cancelListing}
                    >
                      Cancel Listing
                    </button>
                    <button
                      className="bg-blue-600 text-white font-bold rounded-lg p-1 w-28 disabled:bg-slate-300"
                      disabled={selectedNft.isListed}
                      onClick={listNft}
                    >
                      List NFT
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-blue-600 text-white font-bold rounded-lg p-1 w-28 disabled:bg-slate-300"
                    onClick={buyNft}
                  >
                    Buy NFT
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NftDetails;
