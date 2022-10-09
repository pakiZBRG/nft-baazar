// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

error Marketplace__NonZeroPrice();
error Marketplace__InsertListingPrice();
error Marketplace__OnlyOwner();
error Marketplace__InsertAskingPrice();

contract Marketplace is ERC721URIStorage {
    using Counters for Counters.Counter;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        uint256 likes;
        bool sold;
    }

    struct Likes {
        uint256 tokenId;
        address liker;
    }

    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    uint256 private listingPrice = 0.01 ether;
    address payable owner;
    mapping(uint256 => MarketItem) private getMarketItem;
    Likes[] public likes;

    event MarketItemCreated(uint256 indexed tokenId);

    constructor() ERC721("Marketplace", "MRKT") {
        owner = payable(msg.sender);
    }

    // minting a token => convert image to non-fungible token (deploy it to IPFS)
    function createToken(string memory tokenURI, uint256 price)
        public
        payable
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        createMarketItem(newTokenId, price);
        return newTokenId;
    }

    // put NFT to the marketplace
    function createMarketItem(uint256 tokenId, uint256 price) private {
        if (price <= 0) revert Marketplace__NonZeroPrice();
        if (msg.value != listingPrice) revert Marketplace__InsertListingPrice();

        // add the created market item to mapping
        getMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            0,
            false
        );

        // transfer the ownership of NFT to the contract
        _transfer(msg.sender, address(this), tokenId);
        emit MarketItemCreated(tokenId);
    }

    // Put NFT on sale
    function putTokenOnSale(uint256 tokenId, uint256 price) public payable {
        if (getMarketItem[tokenId].owner != msg.sender)
            revert Marketplace__OnlyOwner();
        if (msg.value != listingPrice) revert Marketplace__InsertListingPrice();

        getMarketItem[tokenId].sold = false;
        getMarketItem[tokenId].price = price;
        getMarketItem[tokenId].seller = payable(msg.sender);
        getMarketItem[tokenId].owner = payable(address(this));

        _itemsSold.decrement();

        _transfer(msg.sender, address(this), tokenId);
    }

    // flow of purchasing a NFT
    function purchaseNFT(uint256 tokenId) public payable {
        if (msg.value != getMarketItem[tokenId].price)
            revert Marketplace__InsertAskingPrice();

        getMarketItem[tokenId].owner = payable(msg.sender);
        getMarketItem[tokenId].sold = true;
        getMarketItem[tokenId].seller = payable(address(0)); // empty => belongs to marketplace

        _itemsSold.increment();
        _transfer(address(this), msg.sender, tokenId);

        payable(owner).transfer(listingPrice);
        payable(getMarketItem[tokenId].seller).transfer(msg.value);
    }

    function like(uint256 tokenId) public {
        likes.push(Likes(tokenId, msg.sender));
        getMarketItem[tokenId].likes += 1;
    }

    function dislike(uint256 tokenId) public {
        require(tokenId < likes.length);
        likes[tokenId] = likes[likes.length - 1];
        likes.pop();
        getMarketItem[tokenId].likes -= 1;
    }

    // Get all unsold items, belonging to marketplace
    function getMarketItems() public view returns (MarketItem[] memory) {
        uint256 totalItems = _tokenIds.current();
        uint256 unsoldItems = _tokenIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItems);

        // is the marketplace the owner?
        for (uint256 i = 0; i < totalItems; ) {
            if (getMarketItem[i + 1].owner == address(this)) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = getMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
            unchecked {
                i++;
            }
        }

        return items;
    }

    // my nfts
    function getMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItems = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItems; ) {
            if (getMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
            unchecked {
                i++;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);

        // is person the owner?
        for (uint256 i = 0; i < totalItems; ) {
            if (getMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = getMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
            unchecked {
                i++;
            }
        }

        return items;
    }

    // person's NFTs that are on sale
    function getListedItems() public view returns (MarketItem[] memory) {
        uint256 totalItems = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItems; ) {
            if (getMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
            unchecked {
                i++;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);

        // is the person the seller?
        for (uint256 i = 0; i < totalItems; ) {
            if (getMarketItem[i + 1].seller == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = getMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
            unchecked {
                i++;
            }
        }

        return items;
    }

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }
}
