import { useContext, useEffect } from "react";
import { ethers } from "ethers";
import { NftMarketplaceContext } from "@/context/NftMarketplaceContext";

const marketplace = () => {
  const { setSigner, fetchContract, currentAccount } = useContext(
    NftMarketplaceContext
  );

  const fetchListedNfts = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    );
    const fetchedNfts = await fetchContract(11155111, provider).getListedNfts();
    console.log(fetchedNfts);
  };

  useEffect(() => {
    fetchListedNfts();
  }, []);

  return <div>marketplace</div>;
};

export default marketplace;
