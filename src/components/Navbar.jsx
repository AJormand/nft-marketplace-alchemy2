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
    <div className="flex justify-center text-lg border-b-2 mb-10">
      <div className="flex justify-between items-center w-[80%] p-2">
        <div className="text-blue-600 font-extrabold">
          <Link href="/">NFT Marketplace</Link>
        </div>
        <div className="flex items-center gap-7">
          <ul className="flex items-center gap-10 font-semibold mr-10">
            <li className="hover:bg-slate-50 p-1 rounded-lg">
              <Link href="/marketplace">Marketplace</Link>
            </li>
            <li className="hover:bg-slate-50 p-1 rounded-lg">
              <Link href="/myNfts">My NFTs</Link>
            </li>
            <li className="hover:bg-slate-50 p-1 rounded-lg">
              <Link href="/mintNft">Mint</Link>
            </li>
            {/* <Web3Button /> */}
          </ul>
          <button
            className="rounded-full bg-blue-600 text-white text-sm font-bold py-2 px-3"
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
