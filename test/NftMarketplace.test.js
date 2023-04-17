const { expect, assert } = require("chai");
const { network, ethers, deployments } = require("hardhat");
const { developmentChains } = require("../helperHardhatConfig");

// console.log(developmentChains);
// console.log(network.name);

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("NftMarketplace", function () {
      let nftMarketplace, deployer, otherAccount;
      const tokenURI = "xxx";

      beforeEach(async function () {
        [deployer, otherAccount] = await ethers.getSigners();

        await deployments.fixture(["All"]);
        nftMarketplace = await ethers.getContract("NftMarketplace");
      });

      describe("mint function", function () {
        it("Counter should start with 0", async () => {
          assert.equal((await nftMarketplace._nftId()).toString(), "0");
        });
        it("Counter should increase to 1 after mint", async () => {
          await nftMarketplace.mint("dsfdsfd");
          assert.equal((await nftMarketplace._nftId()).toString(), "1");
        });
        it("Should mint the NFT with expected tokenURI", async () => {
          await nftMarketplace.mint(tokenURI);
          const returnedTokenURI = await nftMarketplace.tokenURI(1);
          assert.equal(tokenURI, returnedTokenURI);
        });
        it("Should return minting account as the owner of NFT", async () => {
          await nftMarketplace.mint(tokenURI);
          assert.equal(await nftMarketplace.ownerOf(1), deployer.address);
        });
        it("Should emit an event when NFT is minted", async () => {
          const tx = await nftMarketplace.mint(tokenURI);
          const tokenId = await nftMarketplace._nftId();
          await expect(tx)
            .to.emit(nftMarketplace, "NftMinted")
            .withArgs(deployer.address, tokenId);
        });
        it("Stores the Nft struct in mintedNfts mapping", async () => {
          await nftMarketplace.mint(tokenURI);
          const expextedNftStruct = {
            id: 1,
            owner: deployer.address,
            uri: tokenURI,
            isListed: false,
            price: 0,
          };
          const returnedNftStruct = await nftMarketplace.getMintedNfts(1);
          expect({
            id: returnedNftStruct[0].toNumber(),
            owner: returnedNftStruct[1],
            uri: returnedNftStruct[2],
            isListed: returnedNftStruct[3],
            price: returnedNftStruct[4].toNumber(),
          }).to.deep.equal(expextedNftStruct);
        });
        it("Stores minted nftIF to ownedNfts mapping", async () => {
          await nftMarketplace.mint(tokenURI);
          await nftMarketplace.mint(tokenURI);
          const ownerNftIDs = await nftMarketplace.getOwnedNfts(
            deployer.address
          );
          expect(ownerNftIDs).to.deep.equal([
            ethers.BigNumber.from(1),
            ethers.BigNumber.from(2),
          ]);
        });
      });

      describe("listNft function", function () {
        it("Lists the nft", async () => {
          await nftMarketplace.mint(tokenURI);
          await nftMarketplace.listNft(1, ethers.utils.parseEther("0.001"));
          const isListed = (await nftMarketplace.getMintedNfts(1)).isListed;
          assert.equal(isListed, true);
          assert.equal(await nftMarketplace._listedNfts(), 1);
        });
        it("Approves the marketplace contract to perform the sell", async () => {
          await nftMarketplace.mint(tokenURI);
          await nftMarketplace.listNft(1, ethers.utils.parseEther("0.001"));
          assert.equal(
            await nftMarketplace.getApproved(1),
            nftMarketplace.address
          );
        });
        it("Allows only the owner to list", async () => {
          await nftMarketplace.mint(tokenURI);
          await expect(
            nftMarketplace
              .connect(otherAccount)
              .listNft(1, ethers.utils.parseEther("0.001"))
          ).to.be.revertedWith("You are not the owner of this NFT");
        });
        it("Allows to list only if price is more than 0", async () => {
          await nftMarketplace.mint(tokenURI);
          await expect(nftMarketplace.listNft(1, 0)).to.be.revertedWith(
            "Price must be greater than 0"
          );
        });
      });

      describe("buyNft function", function () {
        beforeEach(async () => {
          await nftMarketplace.mint(tokenURI);
          await nftMarketplace.listNft(1, ethers.utils.parseEther("0.001"));
        });
        it("Updates ownedNfts mapping if seller has 1 nft", async () => {
          const listedNft = await nftMarketplace.getMintedNfts(1);
          await nftMarketplace
            .connect(otherAccount)
            .buyNft(listedNft.id, { value: listedNft.price });

          assert.equal(
            (await nftMarketplace.getOwnedNfts(deployer.address)).toString(),
            ""
          );
          assert.equal(
            (
              await nftMarketplace.getOwnedNfts(otherAccount.address)
            ).toString(),
            1
          );
        });
        it("Updates ownedNfts mapping if seller has 2 or more nfts", async () => {
          await nftMarketplace.mint(tokenURI); //mint another NFT so that deployer owns 2
          const listedNft = await nftMarketplace.getMintedNfts(1);
          await nftMarketplace
            .connect(otherAccount)
            .buyNft(listedNft.id, { value: listedNft.price });

          assert.equal(
            (await nftMarketplace.getOwnedNfts(deployer.address)).toString(),
            2
          );
          assert.equal(
            (
              await nftMarketplace.getOwnedNfts(otherAccount.address)
            ).toString(),
            1
          );
        });

        it("Transfers the founds from the buyer to seller", async () => {
          const listedNft = await nftMarketplace.getMintedNfts(1);
          const sellerBalanceInit = await ethers.provider.getBalance(
            deployer.address
          );
          const buyerBalanceInit = await ethers.provider.getBalance(
            otherAccount.address
          );

          const tx = await nftMarketplace
            .connect(otherAccount)
            .buyNft(listedNft.id, { value: listedNft.price });
          const receipt = await tx.wait();

          const sellerBalanceFinal = await ethers.provider.getBalance(
            deployer.address
          );
          const buyerBalanceFinal = await ethers.provider.getBalance(
            otherAccount.address
          );

          const gasSpent = receipt.gasUsed.mul(tx.gasPrice).toString();

          const expectedBuyerBalanceFinal = buyerBalanceInit
            .sub(listedNft.price)
            .sub(gasSpent);
          assert.equal(
            expectedBuyerBalanceFinal.toString(),
            buyerBalanceFinal.toString()
          );

          const expectedSellerBalanceFinal = sellerBalanceInit.add(
            listedNft.price
          );
          assert.equal(
            expectedSellerBalanceFinal.toString(),
            sellerBalanceFinal.toString()
          );
        });
        it("Updates owner and price in the Nft struct in mintedNfts mapping", async () => {
          nftStructListed = await nftMarketplace.getMintedNfts(1);
          await nftMarketplace
            .connect(otherAccount)
            .buyNft(nftStructListed.id, { value: nftStructListed.price });
          nftStructAfterBuying = await nftMarketplace.getMintedNfts(1);
          assert.equal(nftStructAfterBuying.isListed, false);
          assert.equal(nftStructAfterBuying.owner, otherAccount.address);
        });
        it("updates the count of _listedNfts", async () => {
          const listedNftNumBefore = await nftMarketplace._listedNfts();
          nftStructListed = await nftMarketplace.getMintedNfts(1);
          await nftMarketplace
            .connect(otherAccount)
            .buyNft(nftStructListed.id, { value: nftStructListed.price });
          const listedNftNumAfter = await nftMarketplace._listedNfts();
          assert.equal(
            listedNftNumBefore.toString(),
            listedNftNumAfter.add(1).toString()
          );
        });
      });

      describe("cancelListing function", function () {
        beforeEach(async () => {
          await nftMarketplace.mint(tokenURI);
          await nftMarketplace.listNft(1, ethers.utils.parseEther("0.001"));
        });

        it("should allow only the owner to delist the nft", async () => {
          await expect(
            nftMarketplace.connect(otherAccount).cancelListing(1)
          ).to.be.revertedWith("You are not the owner of this NFT");
        });

        it("should allow only listed nfts to be delisted", async () => {
          await nftMarketplace.mint(tokenURI);
          await expect(nftMarketplace.cancelListing(2)).to.be.revertedWith(
            "Nft is not listed"
          );
        });

        it("should set isListed to false and price to 0", async () => {
          const tx = await nftMarketplace.cancelListing(1);
          const nft = await nftMarketplace.getMintedNfts(1);
          assert.equal(nft.isListed, false);
          assert.equal(nft.price, 0);
        });

        it("should decrement the number of listed nfts", async () => {
          const listedNftsBeforeCancel = await nftMarketplace._listedNfts();
          const tx = await nftMarketplace.cancelListing(1);
          const listedNftsAfterCancel = await nftMarketplace._listedNfts();
          assert.equal(
            listedNftsAfterCancel.toNumber(),
            listedNftsBeforeCancel.toNumber() - 1
          );
        });
      });

      describe("getListedNfts function", function () {
        it("Should return array of listed nfts", async () => {
          const nft1 = await nftMarketplace.mint("Nft1");
          const nft2 = await nftMarketplace.mint("Nft2");
          const nft3 = await nftMarketplace.mint("Nft3");
          const nft4 = await nftMarketplace.mint("Nft4");

          await nftMarketplace.listNft(1, ethers.utils.parseEther("0.01"));
          await nftMarketplace.listNft(4, ethers.utils.parseEther("0.01"));

          const getListedNfts = await nftMarketplace.getListedNfts();
          expect(getListedNfts.length).to.equal(2);
          assert.equal(getListedNfts[0].id, 1);
          assert.equal(getListedNfts[1].id, 4);
        });
      });
    });
