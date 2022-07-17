// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard{
    address payable public immutable feeAccount;
    uint public immutable feePercent;
    uint public itemCount;

    struct Item{
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }

    event Offered (
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        address indexed seller,
        address indexed buyer
    );
    

    mapping(uint => Item) public items;

    constructor(uint _feePercent){
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    function makeItems(IERC721 _nft, uint _tokenID, uint _price ) external nonReentrant{
        require(_price >0, "Price must be greater than 0");
        itemCount++;
        _nft.transferFrom(msg.sender, address(this), _tokenID);

        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenID,
            _price,
            payable(msg.sender),
            false
        );
        emit Offered(itemCount,address(_nft) , _tokenID, _price, msg.sender);

    }

    function purchaseItem(uint _itemId) external payable nonReentrant{
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId >0 && _itemId <= itemCount, "Item does not exist");
        require(msg.value >= _totalPrice, "Insufficient funds");
        require(!item.sold, "Item already sold");

        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);

        item.sold = true;

        item.nft.transferFrom(address(this), msg.sender, item.tokenId);

        //emit Bought event


    }

    function getTotalPrice( uint _itemId) public view returns (uint){
       return items[_itemId].price * (100 * feePercent / 100);
    }
}