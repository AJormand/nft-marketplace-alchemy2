import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { NftMarketplaceContext } from "@/context/NftMarketplaceContext";
import NftCard from "@/components/NftCard";
import NftDetails from "@/components/NftDetails";

const marketplace = () => {
  const { setSigner, fetchContract, currentAccount } = useContext(
    NftMarketplaceContext
  );
  const [nfts, setNfts] = useState([]);
  const [selectedNft, setSelectedNft] = useState(null);

  const fetchListedNfts = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    );
    const fetchedNfts = await fetchContract(11155111, provider).getListedNfts();
    console.log(fetchedNfts);
  };

  const fetchNftUri = async () => {
    const nftsArr = fetchedNfts.map(async (fetchedNft) => {
      const options = {
        method: "POST",
        body: fetchedNft[2],
      };
      const url = "./api/handleIpfs";
      const res = await fetch(url, options);
      const data = await res.json();
      console.log(data.success);

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
    });
    setNfts(nftsArr);
  };

  useEffect(() => {
    fetchListedNfts();
  }, []);

  return (
    <div className="flex justify-center flex-wrap gap-5">
      {nfts.length > 0 ? (
        nfts.map((nft, index) => (
          <NftCard data={nft} key={index} setSelectedNft={setSelectedNft} />
        ))
      ) : (
        <div>No NFTs listed for sale</div>
      )}

      {/* NFT DETAILS */}
      {selectedNft && (
        <NftDetails selectedNft={selectedNft} setSelectedNft={setSelectedNft} />
      )}
    </div>
  );
};

export default marketplace;
