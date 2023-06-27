import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { NftMarketplaceContext } from "@/context/NftMarketplaceContext";
import NftCard from "@/components/NftCard";
import NftDetails from "@/components/NftDetails";

const marketplace = () => {
  const { signer, setSigner, fetchContract, currentAccount } = useContext(
    NftMarketplaceContext
  );
  const [nfts, setNfts] = useState([]);
  const [selectedNft, setSelectedNft] = useState(null);

  const fetchListedNfts = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    );
    const fetchedNfts = await fetchContract(11155111, provider).getListedNfts();

    const fetchedNftsArr = await Promise.all(
      fetchedNfts.map(async (fetchedNft) => {
        return fetchNft(fetchedNft);
      })
    );
    setNfts(fetchedNftsArr);
    console.log(fetchedNftsArr);
  };

  const fetchNft = async (fetchedNft) => {
    const options = {
      method: "POST",
      body: fetchedNft[2],
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

  useEffect(() => {
    fetchListedNfts();
  }, []);

  useEffect(() => {
    const handleNftDelistedEvent = (owner, tokenId, price) => {
      setNfts((prevNfts) => prevNfts.filter((nft) => nft.id != tokenId));
      setSelectedNft((prev) => ({ ...prev, price: "0", isListed: false }));
    };
    const handleNftBoughtEvent = (owner, tokenId, price) => {
      setNfts((prevNfts) => prevNfts.filter((nft) => nft.id != tokenId));
      setSelectedNft((prev) => ({
        ...prev,
        price: "0",
        isListed: false,
        owner: owner,
      }));
    };
    const contract = fetchContract(11155111, signer);
    if (window.ethereum && signer) {
      contract
        .on("NftDelisted", handleNftDelistedEvent)
        .on("NftBought", handleNftBoughtEvent);
    }

    return () =>
      contract
        .off("NftDelisted", handleNftDelistedEvent)
        .off("NftBought", handleNftBoughtEvent);
  }, [signer]);

  return (
    <div className="flex justify-center">
      <div className="flex w-[70%] justify-center flex-wrap gap-5">
        {nfts.length > 0 ? (
          nfts.map((nft, index) => (
            <NftCard data={nft} key={index} setSelectedNft={setSelectedNft} />
          ))
        ) : (
          <div>No NFTs listed for sale</div>
        )}

        {/* NFT DETAILS */}
        {selectedNft && (
          <NftDetails
            selectedNft={selectedNft}
            setSelectedNft={setSelectedNft}
          />
        )}
      </div>
    </div>
  );
};

export default marketplace;
