import React, { useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { NftMarketplaceContext } from "@/context/NftMarketplaceContext";
import NftCard from "@/components/NftCard";
import NftDetails from "@/components/NftDetails";

const myNfts = () => {
  const { fetchContract, currentAccount, signer } = useContext(
    NftMarketplaceContext
  );
  const [nfts, setNfts] = useState([]);
  const [selectedNft, setSelectedNft] = useState(null);

  const fetchMyNfts = async () => {
    console.log(currentAccount);
    const nftIds = await fetchContract(11155111, signer).getOwnedNfts(
      currentAccount
    );

    const fetchNft = async (nftId) => {
      const fetchedNft = await fetchContract(11155111, signer).getMintedNfts(
        nftId
      );
      return {
        id: fetchedNft[0].toString(),
        owner: fetchedNft[1],
        uri: fetchedNft[2],
        isListed: fetchedNft[3],
        price: ethers.utils.formatEther(fetchedNft[4].toString()),
      };
    };

    const fetchedNftsArr = await Promise.all(
      nftIds.map(async (nftId) => {
        return fetchNft(nftId);
      })
    );
    setNfts(fetchedNftsArr);
  };

  useEffect(() => {
    if (!currentAccount == "") {
      fetchMyNfts();
    }
  }, [currentAccount]);

  return (
    <div className="flex justify-center flex-wrap gap-5">
      {currentAccount === "" ? (
        <div>Please connect your Metamask account to see your NFTs!</div>
      ) : nfts.length > 0 ? (
        nfts.map((nft, index) => (
          <NftCard data={nft} key={index} setSelectedNft={setSelectedNft} />
        ))
      ) : (
        <div>You don't own any NFTs yet</div>
      )}

      {/* NFT DETAILS */}
      {selectedNft && (
        <NftDetails selectedNft={selectedNft} setSelectedNft={setSelectedNft} />
      )}
    </div>
  );
};

export default myNfts;
