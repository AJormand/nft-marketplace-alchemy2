const { ethers } = require("hardhat");

const verify = async (args) => {
  const nftMarketplace = await ethers.getContract("NftMarketplace");

  await run("verify:verify", {
    address: nftMarketplace.address,
    constructorArguments: [args],
  });

  console.log("Contract verified at: ", nftMarketplace.address);
};

module.exports = { verify };
