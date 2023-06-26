const { ethers } = require("hardhat");

async function main() {
  const nftMarketplace = await ethers.getContract("NftMarketplace");
  const tokenUris = [
    {
      name: "Rain Cloud",
      uri: "ipfs://Qmbd5Lq7r4gshN6yCffQ7JshuyjXsC3xVSsaNdP3AZBvpi?_gl=1*13x4cmu*rs_ga*YzAyNTc2NmUtZDAwNC00M2JiLTk4ODEtYzg3NzhjMDkwYzgz*rs_ga_5RMPXG14TE*MTY4MTkwMjMxOS4xMi4xLjE2ODE5MDIzMzguNDEuMC4w",
    },
    {
      name: "Dino scateboarding",
      uri: "ipfs://QmUPwAEHDgGfBMZwEjzDN2kPB9bKcHZk1mnpnAyd938c4B?_gl=1*1oa7i6d*rs_ga*YzAyNTc2NmUtZDAwNC00M2JiLTk4ODEtYzg3NzhjMDkwYzgz*rs_ga_5RMPXG14TE*MTY4MTkwMjMxOS4xMi4xLjE2ODE5MDIzMzguNDEuMC4w",
    },
    {
      name: "Flash woman",
      uri: "ipfs://QmbijqY3iYHWhArGXQkt3FJgmjDXmdzcfEtvQf4UhdFt1K?_gl=1*1t9bro4*rs_ga*YzAyNTc2NmUtZDAwNC00M2JiLTk4ODEtYzg3NzhjMDkwYzgz*rs_ga_5RMPXG14TE*MTY4MTkwMjMxOS4xMi4xLjE2ODE5MDIzMzguNDEuMC4w",
    },
    {
      name: "Music band",
      uri: "ipfs://QmY8hWTKap6NTLdcKXDeyAtzRfmxePA7uKkk5UkngJx6ZX",
    },
    {
      name: "Surfer sunset",
      uri: "ipfs://QmY7kAd7CSVD3oBe6f1X3PKJfKGy64HEm2DW2RGQ6YqKpE",
    },
    {
      name: "Rainbow Lion",
      uri: "ipfs://QmXgqAiUVUTvFZCbJBviY8zmyPJ7RZpeEsiUMyNjkLSRYb",
    },
    {
      name: "Platform",
      uri: "ipfs://QmPiVDMRakxw3q4Wxq7maCJrrMPJ3L9yHgdEFY5HbPcVUM",
    },
  ];

  console.log("Minting NFT....");

  for (element of tokenUris) {
    const mintTx = await nftMarketplace.mint(element.uri);
    const mintTxReceipt = await mintTx.wait(1);
    const tokenId = mintTxReceipt.events[0].args.tokenId;
    console.log(`Token minted - ID: ${tokenId}`);
  }
}

main()
  .then(() => {
    console.log("NFT minting complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
