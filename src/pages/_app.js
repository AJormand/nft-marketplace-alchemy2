import "@/styles/globals.css";
import { NftMarketplaceContextProvider } from "@/context/NftMarketplaceContext";

import Navbar from "@/components/Navbar";

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { sepolia, goerli } from "wagmi/chains";

const chains = [sepolia, goerli];
const projectId = "814f1bd9aa1ee6f27452d1d8b01488bf";

const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
});
const ethereumClient = new EthereumClient(wagmiClient, chains);

export default function App({ Component, pageProps }) {
  return (
    <NftMarketplaceContextProvider>
      <WagmiConfig client={wagmiClient}>
        <Navbar />
        <Component {...pageProps} />
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </NftMarketplaceContextProvider>
  );
}

//15:08
