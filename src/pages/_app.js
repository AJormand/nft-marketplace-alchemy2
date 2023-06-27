import "@/styles/globals.css";
import { NftMarketplaceContextProvider } from "@/context/NftMarketplaceContext";

import Navbar from "@/components/Navbar";

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { sepolia, goerli } from "wagmi/chains";

const chains = [sepolia, goerli];
const projectId = "814f1bd9aa1ee6f27452d1d8b01488bf";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function App({ Component, pageProps }) {
  return (
    <NftMarketplaceContextProvider>
      <WagmiConfig config={wagmiConfig}>
        <Navbar />
        <Component {...pageProps} />
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </NftMarketplaceContextProvider>
  );
}

//15:08
