//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Eye is ERC721, Ownable, ReentrancyGuard {
	using Strings for uint256;
	using Address for address payable;

	enum MintStatus {
		CLOSED,
		PRESALE,
		PUBLIC
	}

	uint256 public constant MAX_SUPPLY = 10;
	uint256 public constant PRICE = 0.01 ether;
	uint256 public constant PRE_SALE_LIMIT = 1;

	string public baseTokenURI = "ipfs://QmdPiRFtpeYzntkHdhJHwygEMXHwPkxiTs2cVdk7taFb2Y";
	uint256 public tokenCount = 0;
	address public withdrawDest1 = 0x2102AE12dED4A8cc8321e656Ca213d3Eaf6151C4;
	MintStatus public mintStatus = MintStatus.CLOSED;
	bytes32 public merkleRoot = 0x71eb2b2e3c82409bb024f8b681245d3eea25dcfd0dc7bbe701ee18cf1e8ecbb1;
	mapping(address => uint256) private _tokensMintedByAddressAtPresale;

	constructor() ERC721("EyeNft", "EYE") {}

	function mint(bytes32[] memory _proof, uint256 _genesisAmount)
		public
		payable
		onlyIfAvailable(_genesisAmount)
		onlyExternal
		nonReentrant
	{

		if (mintStatus == MintStatus.PRESALE) {
			require(_genesisAmount == 1, "Must mint exactly 1 genesis NFT");

			_mintPresale(_proof);
		} else if (mintStatus == MintStatus.PUBLIC) {
			require(_genesisAmount > 0, "Must mint at least 1 genesis NFT");
			require(_genesisAmount < 3, "Minting limits exceeded");

			_mintPublic(_genesisAmount);
		}
	}

	function _mintPresale(bytes32[] memory _proof) private {
		require(MerkleProof.verify(_proof, merkleRoot, keccak256(abi.encodePacked(msg.sender))), "not whitelisted");
		require(_tokensMintedByAddressAtPresale[msg.sender] < PRE_SALE_LIMIT, "You can only mint 1 genesis NFT during the presale");

		_mintPrivate(msg.sender, 1);

		_tokensMintedByAddressAtPresale[msg.sender] += 1;
	}

	function _mintPublic(uint256 _amount) private {
		require(mintStatus == MintStatus.PUBLIC, "Wrong mint status");

		_mintPrivate(msg.sender, _amount);
	}

	function _mintPrivate(address _to, uint256 _amount) private {
		for (uint256 i; i < _amount; i++) {
			_safeMint(_to, ++tokenCount);
		}
	}

	// Override so the openzeppelin tokenURI() method will use this method to
    // create the full tokenURI instead
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

	function setBaseTokenURI(string memory _baseTokenURI) public onlyOwner {
		baseTokenURI = _baseTokenURI;
	}

	function setWithdrawDest1(address _withdrawDest1) external onlyOwner {
		withdrawDest1 = _withdrawDest1;
	}

	function setStatus(uint8 _status) external onlyOwner {
		mintStatus = MintStatus(_status);
	}

	function setMerkeRoot(bytes32 _root) external onlyOwner {
		merkleRoot = _root;
	}

	function withdraw() public onlyOwner {
		require(address(this).balance != 0, "Balance is zero");

		payable(withdrawDest1).sendValue(address(this).balance);
	}

	modifier onlyExternal() {
		require(msg.sender == tx.origin, "Contracts not allowed to mint");
		_;
	}

	modifier onlyIfAvailable(uint256 _genesisAmount) {
		require(mintStatus != MintStatus.CLOSED, "Wrong mint status");
		require(tokenCount + _genesisAmount <= MAX_SUPPLY, "Not enough supply");

		uint256 expectedValue = PRICE * _genesisAmount;
		require(msg.value == expectedValue, "Ether sent is not correct");
		_;
	}
}
