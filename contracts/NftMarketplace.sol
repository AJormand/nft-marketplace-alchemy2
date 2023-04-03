// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "hardhat/console.sol";

contract NftMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter public _nftId;
    Counters.Counter public _listedNfts;

    struct Nft {
        uint256 id;
        address owner;
        string uri;
        bool isListed;
        uint256 price;
    }

    mapping(uint256 => Nft) public mintedNfts;
    mapping(address => uint256[]) public ownedNfts;

    constructor() ERC721("MyToken", "MTK"){

    }

    event NftMinted(address indexed owner, uint256 indexed tokenId);
    event NftListed(address indexed owner, uint256 indexed tokenId);


    function mint(string memory tokenURI) public  {
        _nftId.increment();
        uint256 currentNftId = _nftId.current();
        _mint(msg.sender, currentNftId);
        _setTokenURI(currentNftId, tokenURI);
        Nft memory mintedNft = Nft(currentNftId,msg.sender,tokenURI,false,0);
        mintedNfts[currentNftId] = mintedNft;

        ownedNfts[msg.sender].push(currentNftId);
    
        emit NftMinted(msg.sender, currentNftId);
    }

    function listNft(uint256 nftId, uint256 price) public {
        Nft memory nft = mintedNfts[nftId];
        require(nft.owner == msg.sender, "You are not the owner of this NFT");
        require(price > 0, "Price must be greater than 0");
        nft.isListed = true;
        nft.price = price;
        mintedNfts[nftId] = nft;
        approve(address(this), nftId);
        _listedNfts.increment();
        emit NftListed(msg.sender, nftId);
    }

    function buyNft(uint nftId) public payable {
        Nft memory nft = mintedNfts[nftId];
        address seller = nft.owner;
        address buyer = msg.sender;
        require(nft.owner != msg.sender, "You cant buy your own NFT");
        require(nft.isListed == true, "NFT that you are trying to buy is not listed for sale");
        require(nft.price == msg.value, "You have not payed the correct price");

        //update Nft struct
        nft.isListed = false;
        nft.owner = buyer;
        nft.price = 0;
        mintedNfts[nftId] = nft;

        //remove nftId from the current owners mapping
        if (ownedNfts[seller].length == 1) {
            ownedNfts[seller] = new uint256[](0);
        } else {
            for (uint i = 0; i < ownedNfts[seller].length; i++) {
                if (ownedNfts[seller][i] == nftId) {
                    ownedNfts[seller][i] = ownedNfts[seller][ownedNfts[seller].length - 1];
                    ownedNfts[seller].pop();
                    break;
                }
            }
        }
        //add nftId to the new owners mapping
        ownedNfts[buyer].push(nftId);

        //Transfer funds to the seller
        payable(seller).transfer(msg.value);

        _listedNfts.decrement();
    }

    //get listed nfts
    function getListedNfts() public view returns(Nft[] memory)  {
        Nft[] memory listedNftsArr = new Nft[](_listedNfts.current());
        uint256 arrayIndex = 0;
        for(uint i = 1; i <= _nftId.current(); i++) {
            if(mintedNfts[i].isListed == true) {
                listedNftsArr[arrayIndex] = mintedNfts[i];
                arrayIndex ++;
            }
        }
        return listedNftsArr;
    }
    //get specific nft
    function getMintedNfts(uint256 tokenId) public view returns(Nft memory) {
        return mintedNfts[tokenId];
    }

    function getOwnedNfts(address owner) public view returns(uint256[] memory) {
        return ownedNfts[owner];
    }
}
