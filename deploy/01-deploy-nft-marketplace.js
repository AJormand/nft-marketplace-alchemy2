const { network } = require("hardhat");
const { developmentChains } = require("../helperHardhatConfig");
const { verify } = require("../scripts/Verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const arguments = [];

  await deploy("NftMarketplace", {
    from: deployer,
    args: [],
    log: true,
  });

  // if (!developmentChains.includes(network.name)) {
  //   //Verifying contract.....
  //   verify(arguments);
  // }
};

module.exports.tags = ["All", "NftMarketplace"];
