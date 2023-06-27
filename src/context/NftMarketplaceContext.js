import { ethers } from "ethers";
import { createContext, useEffect, useState } from "react";
import { Web3Modal } from "@web3modal/react";

import NftMarketplaceABI from "../constants/NftMarketplaceABI.json";
import networkMapping from "../constants/networkMapping.json";

//---CONNECTING WITH SMART CONTRACT
const connectingWithSmartContract = async () => {
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    console.log("signer", signer);
    const chainId = (await provider.getNetwork()).chainId;
    console.log(chainId);
    const contract = fetchContract(signer, chainId);
  } catch (error) {
    console.log("Smth wenr wrong when connecting with contract", error);
  }
};

export const NftMarketplaceContext = createContext();

export const NftMarketplaceContextProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [signer, setSigner] = useState(null);

  //----CONNECT SMART CONTRACT
  const fetchContract = (chainId, signerOrProvider) => {
    const contractAddress = networkMapping.find(
      (element) => element.chainId == chainId
    ).contractAddress;
    console.log(contractAddress[0]);

    return new ethers.Contract(
      contractAddress[0],
      NftMarketplaceABI,
      signerOrProvider
    );
  };

  //---CONNECT CONTRACT
  const checkContract = async () => {
    const contract = await connectingWithSmartContract();
    console.log(contract);
  };

  //---CHECK IF WALLET IS CONNECTED
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return console.log("Install Metamask");

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(ethers.utils.getAddress(accounts[0]));
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signerAccount = provider.getSigner();
        setSigner(signerAccount);
      } else {
        console.log("No Account found");
      }
    } catch (error) {
      console.log("Something wrong when connecting to wallet", error);
    }
  };

  //---CONNECT WALLET
  const connectWallet = async () => {
    console.log("connect wallet");
    try {
      if (!window.ethereum) return console.log("Install Metamask");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(ethers.utils.getAddress(accounts[0]));
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signerAccount = provider.getSigner();
      setSigner(signerAccount);
      window.location.reload();
    } catch (error) {
      console.log("Error while connecting wallet", error);
    }
  };

  //--ON ACCOUNT CHANGE
  const onAccountChange = async () => {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setCurrentAccount(ethers.utils.getAddress(accounts[0]));
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signerAccount = provider.getSigner();
        setSigner(signerAccount);
      } else {
        setCurrentAccount("");
      }
    });
  };

  useEffect(() => {
    onAccountChange();
    checkIfWalletConnected();
  }, [currentAccount]);

  return (
    <NftMarketplaceContext.Provider
      value={{
        currentAccount,
        checkContract,
        checkIfWalletConnected,
        connectWallet,
        fetchContract,
        signer,
      }}
    >
      {children}
    </NftMarketplaceContext.Provider>
  );
};

//npm i ipfs-http-client
//npm i axios
//import { create as ipfsHttpClient } from "ipfs-http-client"
