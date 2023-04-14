import { useState, useEffect, useContext } from "react";
import Link from "next/link";

import { ethers } from "ethers";
import { Web3Button } from "@web3modal/react";

import { NftMarketplaceContext } from "@/context/NftMarketplaceContext";

const Navbar = () => {
  const { currentAccount, checkContract, connectWallet } = useContext(
    NftMarketplaceContext
  );

  useEffect(() => {
    checkContract();
  }, []);

  return (
    <div className="flex justify-center text-xl border-b-2 mb-10">
      <div className="flex justify-between items-center w-[80%] p-2">
        <div className="text-blue-600 font-extrabold text-2xl">
          NFT Marketplace
        </div>
        <div className="flex items-center gap-7">
          <ul className="flex gap-10">
            <li>
              <Link href="/marketplace">Marketplace</Link>
            </li>
            <li>
              <Link href="/myNfts">My NFTs</Link>
            </li>
            <li>
              <Link href="/mintNft">Mint</Link>
            </li>
            <Web3Button />
          </ul>
          <button
            className="rounded-full bg-blue-600 text-white p-2"
            onClick={() => connectWallet()}
          >
            {currentAccount == ""
              ? "Connect Wallet"
              : `${currentAccount.slice(0, 4)}...${currentAccount.slice(-4)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
