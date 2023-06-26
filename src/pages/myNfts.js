import React, { useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { NftMarketplaceContext } from "@/context/NftMarketplaceContext";
import NftCard from "@/components/NftCard";
import NftDetails from "@/components/NftDetails";
import axios from "axios";

const myNfts = () => {
  const { fetchContract, currentAccount, signer } = useContext(
    NftMarketplaceContext
  );
  const [nfts, setNfts] = useState([]);
  const [selectedNft, setSelectedNft] = useState(null);

  const fetchNft = async (nftId) => {
    const fetchedNft = await fetchContract(11155111, signer).getMintedNfts(
      nftId
    );
    console.log(fetchedNft);

    const options = {
      method: "POST",
      body: fetchedNft[2], //uri ipfs://xcvsf
    };
    const url = "./api/handleIpfs";
    const res = await fetch(url, options);
    const data = await res.json();

    //Ipfs gateway for loading image
    const pinataGateway = "https://gateway.pinata.cloud/ipfs/";
    //const ipfsGateway = "https://ipfs.io/ipfs/";

    return {
      id: fetchedNft[0].toString(),
      owner: fetchedNft[1],
      name: data.success?.name,
      description: data.success?.description,
      image: data.success?.image?.replace("ipfs://", pinataGateway),
      isListed: fetchedNft[3],
      price: ethers.utils.formatEther(fetchedNft[4].toString()),
    };
  };

  const fetchMyNfts = async () => {
    console.log(currentAccount);
    const contract = await fetchContract(11155111, signer);
    const nftIds = await contract.getOwnedNfts(currentAccount);

    const fetchedNftsArr = await Promise.all(
      nftIds.map(async (nftId) => {
        return fetchNft(nftId);
      })
    );
    setNfts(fetchedNftsArr);
    console.log(fetchedNftsArr);
  };

  useEffect(() => {
    if (!currentAccount == "") {
      fetchMyNfts();
    }
  }, [currentAccount]);

  //Event listeners
  useEffect(() => {
    const handleNftListedEvent = (owner, tokenId, price) => {
      // console.log(tokenId.toString());
      // console.log(ethers.utils.formatEther(price.toString()));
      setNfts((prevNfts) =>
        prevNfts.map((nft) => {
          if (nft.id == tokenId.toString()) {
            nft.price = ethers.utils.formatEther(price.toString());
            nft.isListed = true;
            setSelectedNft(nft);
          }
          return nft;
        })
      );
    };
    const handleNftDelistedEvent = (owner, tokenId, price) => {
      // console.log(tokenId.toString());
      // console.log(ethers.utils.formatEther(price.toString()));
      setNfts((prevNfts) =>
        prevNfts.map((nft) => {
          if (nft.id == tokenId.toString()) {
            nft.price = ethers.utils.formatEther(price.toString());
            nft.isListed = false;
            setSelectedNft(nft);
          }
          return nft;
        })
      );
    };
    const contract = fetchContract(11155111, signer);

    if (window.ethereum && signer) {
      contract.on("NftListed", handleNftListedEvent);
      contract.on("NftDelisted", handleNftDelistedEvent);
    }

    return () => {
      contract.off("NftListed", handleNftListedEvent);
      contract.off("NftDelisted", handleNftDelistedEvent);
    };
  }, [signer]);

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
