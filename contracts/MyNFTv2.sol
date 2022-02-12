//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MyNFTv2 is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint16 private numbers = 0;
    uint16 public totalSupply = 1000;
    uint256 public mintPrice = 10000000000000000000; //10 one
    uint256 public totalStakersReward = 0;

    address payable admin;

    address payable[] public stakers;
    mapping(address => uint256) private stakersReward;
    mapping(address => uint256) private stakersAllocation;

    event MintingNFT(address _recipient, uint16 _tokenId);
    event TakeStakeReward(address _recipient, uint256 _value);

    constructor() ERC721("MyNFT", "NFT") {
        admin = payable(msg.sender);
    }

    function mintNFT(address recipient, string memory tokenURI)
        public
        payable
        returns (uint256)
    {
        // check if nft still avaiable
        require(numbers < totalSupply, "Stock NFT sudah habis");

        //check if wallet transfering enough token
        require(msg.value == mintPrice, "Token tidak sesuai");

        _tokenIds.increment();
        // increase numbers by one every minting for tracking
        numbers++;

        uint256 newItemId = _tokenIds.current();

        // musti perbaikin cara minting karena harus di hash nama file nya kalau nggk bisa di cek langsung

        _mint(recipient, newItemId);
        _setTokenURI(newItemId, createTokenUri(tokenURI, newItemId));

        if (stakersAllocation[msg.sender] == 0) {
            stakersAllocation[msg.sender] = 1;
            stakers.push(payable(msg.sender));
        } else {
            stakersAllocation[msg.sender] = stakersAllocation[msg.sender] + 1;
        }

        allocateStakersReward();

        emit MintingNFT(msg.sender, numbers);
        return newItemId;
    }

    function allocateStakersReward() private {
        uint256 allocatedRewards = mintPrice / 10;
        totalStakersReward = totalStakersReward + allocatedRewards;
        uint256 eachStakeRewards = allocatedRewards / numbers;

        for (uint32 i = 0; i < stakers.length; i++) {
            uint256 reward = stakersAllocation[stakers[i]] * eachStakeRewards;
            stakersReward[stakers[i]] = stakersReward[stakers[i]] + reward;
        }
    }

    function getMyStake() external view returns (uint256) {
        return stakersReward[msg.sender];
    }

    function createTokenUri(string memory _tokenURI, uint256 _newItemId)
        private
        pure
        returns (string memory)
    {
        return
            string(abi.encodePacked(_tokenURI, uint2str(_newItemId), ".json"));
    }

    function uint2str(uint256 _i)
        internal
        pure
        returns (string memory _uintAsString)
    {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function getTotalMinted() external view returns (uint16) {
        return numbers;
    }

    function getBalance() public view onlyOwner returns (uint256) {
        return address(this).balance - totalStakersReward;
    }

    function takeBalance() external onlyOwner {
        admin.transfer(getBalance() - totalStakersReward);
    }

    function takeStake() external {
        require(stakersReward[msg.sender] > 0,"Redeemeable Stake is already 0");
        uint256 value = stakersReward[msg.sender];
        stakersReward[msg.sender] = 0;
        payable(msg.sender).transfer(value);
        emit TakeStakeReward(msg.sender, value);
    }

    function setMintPrice(uint256 _mintPrice) external onlyOwner {
        mintPrice = _mintPrice;
    }

    receive() external payable {}
}
