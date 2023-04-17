const fs = require("fs");
const { ethers, network } = require("hardhat");

const frontendNetworkMApping =
  "../07_nft_marketplace2/src/constants/networkMapping.json";
const frontendAbiLocation =
  "../07_nft_marketplace2/src/constants/NftMarketplaceABI.json";
const UPDATE_FRONT_END = process.env.UPDATE_FRONT_END;

module.exports = async () => {
  if (UPDATE_FRONT_END) {
    console.log("-----Updating FRONTEND-------");
    await updateAbi();
    await updateNetworkMapping();
  }
};

const updateAbi = async () => {
  const nftMarketplace = await ethers.getContract("NftMarketplace");
  const nftMarketplaceABI = nftMarketplace.interface;

  fs.writeFileSync(
    frontendAbiLocation,
    nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
  );
};

const updateNetworkMapping = async () => {
  const nftMarketplace = await ethers.getContract("NftMarketplace");
  const nftMarketplaceAddress = nftMarketplace.address;
  const chainId = network.config.chainId;

  const fileJSON = fs.readFileSync(frontendNetworkMApping, "utf8");
  const file = JSON.parse(fileJSON);

  if (!file.some((object) => object.chainId == chainId)) {
    file.push({ chainId: chainId, contractAddress: [nftMarketplaceAddress] });
  } else {
    for (let i = 0; i < file.length; i++) {
      if (
        file[i].chainId == chainId &&
        !file[i].contractAddress.includes(nftMarketplaceAddress)
      ) {
        file[i].contractAddress.unshift(nftMarketplaceAddress);
      }
    }
  }

  fs.writeFileSync(frontendNetworkMApping, JSON.stringify(file));
};

module.exports.tags = ["All"];
