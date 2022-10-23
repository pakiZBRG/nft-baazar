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
error Marketplace__SentToOwnerFailed();
error Marketplace__SentToSellerFailed();
error Marketplace__CantBuyYourNFT();

contract Marketplace is ERC721URIStorage {
    using Counters for Counters.Counter;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        address payable creator;
        uint256 createdAt;
        uint256 old_price;
        uint256 price;
        bool isSelling;
    }

    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsForSell;
    uint256 private listingPrice = 0.01 ether;
    address payable owner;
    mapping(uint256 => MarketItem) private marketItem;

    event MarketItemBought(
        uint256 indexed tokenId,
        uint256 price,
        uint256 timestamp,
        address buyer
    );

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

    // create your NFT
    function createMarketItem(uint256 tokenId, uint256 price) private {
        if (price <= 0) revert Marketplace__NonZeroPrice();
        if (msg.value != listingPrice) revert Marketplace__InsertListingPrice();

        // add the created market item to mapping
        marketItem[tokenId] = MarketItem(
            tokenId,
            payable(address(0)),
            payable(msg.sender),
            payable(msg.sender),
            block.timestamp,
            price,
            price,
            false
        );

        emit MarketItemBought(tokenId, price, block.timestamp, msg.sender);
    }

    // Put NFT on sale
    function putTokenOnSale(uint256 tokenId, uint256 price) public payable {
        if (marketItem[tokenId].owner != msg.sender)
            revert Marketplace__OnlyOwner();
        if (msg.value != listingPrice) revert Marketplace__InsertListingPrice();

        marketItem[tokenId].isSelling = true;
        marketItem[tokenId].price = price;
        marketItem[tokenId].seller = payable(msg.sender);
        marketItem[tokenId].owner = payable(address(this));

        _itemsForSell.increment();

        // transfer the ownership of NFT to the contract
        _transfer(msg.sender, address(this), tokenId);
    }

    // Remove NFT from market, return price as before
    function removeTokenFromMarket(uint256 tokenId) public {
        if (marketItem[tokenId].seller != msg.sender)
            revert Marketplace__OnlyOwner();

        marketItem[tokenId].seller = payable(address(0));
        marketItem[tokenId].owner = payable(msg.sender);
        marketItem[tokenId].isSelling = false;
        marketItem[tokenId].price = marketItem[tokenId].old_price;
        _itemsForSell.decrement();

        // transfer the ownership of NFT to the owner
        _transfer(address(this), msg.sender, tokenId);
    }

    // purchasing a NFT
    function purchaseToken(uint256 tokenId) public payable {
        if (msg.value != marketItem[tokenId].price)
            revert Marketplace__InsertAskingPrice();
        if (msg.sender == marketItem[tokenId].seller)
            revert Marketplace__CantBuyYourNFT();

        marketItem[tokenId].owner = payable(msg.sender);
        marketItem[tokenId].isSelling = false;
        marketItem[tokenId].price = msg.value;
        marketItem[tokenId].old_price = msg.value;

        _itemsForSell.decrement();
        _transfer(address(this), msg.sender, tokenId);

        (bool sentToOwner, ) = payable(owner).call{value: listingPrice}("");
        if (!sentToOwner) revert Marketplace__SentToOwnerFailed();
        (bool sentToSeller, ) = payable(marketItem[tokenId].seller).call{
            value: msg.value
        }("");
        if (!sentToSeller) revert Marketplace__SentToSellerFailed();
        marketItem[tokenId].seller = payable(address(0));

        emit MarketItemBought(tokenId, msg.value, block.timestamp, msg.sender);
    }

    // Get all items on sale
    function getMarketNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItems = _tokenIds.current();
        uint256 itemsForSell = _itemsForSell.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](itemsForSell);

        // is the marketplace the current owner?
        for (uint256 i = 0; i < totalItems; ) {
            if (marketItem[i + 1].owner == address(this)) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = marketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
            unchecked {
                i++;
            }
        }

        return items;
    }

    // persons nfts (owner and seller)
    function getPersonsNFTs(address person)
        public
        view
        returns (MarketItem[] memory)
    {
        uint256 totalItems = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItems; ) {
            if (
                marketItem[i + 1].owner == person ||
                marketItem[i + 1].seller == person
            ) {
                itemCount += 1;
            }
            unchecked {
                i++;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);

        // is person the owner or the seller?
        for (uint256 i = 0; i < totalItems; ) {
            if (
                marketItem[i + 1].owner == person ||
                marketItem[i + 1].seller == person
            ) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = marketItem[currentId];
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

    function getMarketItem(uint256 tokenId)
        public
        view
        returns (MarketItem memory)
    {
        return marketItem[tokenId];
    }
}
