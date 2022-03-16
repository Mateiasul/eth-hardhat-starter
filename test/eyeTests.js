const {ethers} = require("hardhat");
const {MerkleTree} = require("merkletreejs");
const keccak256 = require("keccak256");
const {expect} = require("chai");

describe("Eye", function () {
	let Eye;
	let deployedEyeNftContract;
	let owner;
	let merkleTree;
	let addr1;

	const whitelistAddresses = [
		"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
		"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
		"0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
	];

	describe("Deployment", function () {
		before(async function () {
			Eye = await ethers.getContractFactory("Eye");
			[owner, addr1, addr2, ...addrs] = await ethers.getSigners();
			deployedEyeNftContract = await Eye.deploy();
		});

		it("Should set the right owner", async function () {
			expect(await deployedEyeNftContract.owner()).to.equal(owner.address);
		});
	});

	describe("MintPresale", function () {
		beforeEach(async function () {
			Eye = await ethers.getContractFactory("Eye");
			[owner, addr1, addr2, ...addrs] = await ethers.getSigners();
			deployedEyeNftContract = await Eye.deploy();

			const leafNotes = whitelistAddresses.map((addr) => keccak256(addr));
			merkleTree = new MerkleTree(leafNotes, keccak256, {
				sortPairs: true,
			});
			deployedEyeNftContract.setStatus(1);

			await deployedEyeNftContract.setMerkeRoot(merkleTree.getHexRoot());
		});

		it("address not whitelisted", async function () {
			const proof = merkleTree.getHexProof(keccak256(addr1.address));
			await expect(deployedEyeNftContract.mint(proof, 1, { value: ethers.utils.parseEther("0.01") })).to.be.revertedWith("not whitelisted");
		});

		it("PRESALE 1 genesis Limit", async function () {
			const proof = merkleTree.getHexProof(keccak256(addr1.address));
			await expect(deployedEyeNftContract.mint(proof, 2, { value: ethers.utils.parseEther("0.02") })).to.be.revertedWith("Must mint exactly 1 genesis NFT");
		});

		it("PRESALE 1 genesis Limit per wallet", async function () {
			const proof = merkleTree.getHexProof(keccak256(owner.address));
			await expect(deployedEyeNftContract.mint(proof, 1, { value: ethers.utils.parseEther("0.01") }))
				.to.emit(deployedEyeNftContract, "Transfer")
				.withArgs(ethers.constants.AddressZero, owner.address, 1);

			await expect(deployedEyeNftContract.mint(proof, 1, { value: ethers.utils.parseEther("0.01") })).to.be.revertedWith("You can only mint 1 genesis NFT during the presale");
		});

		it("PRESALE mint successful", async function () {
			const proof = merkleTree.getHexProof(keccak256(owner.address));
			await expect(deployedEyeNftContract.mint(proof, 1, { value: ethers.utils.parseEther("0.01") }))
				.to.emit(deployedEyeNftContract, "Transfer")
				.withArgs(ethers.constants.AddressZero, owner.address, 1);
		});
	});

	describe("MintPublic", function () {
		beforeEach(async function () {
			Eye = await ethers.getContractFactory("Eye");
			[owner, addr1, addr2, ...addrs] = await ethers.getSigners();
			deployedEyeNftContract = await Eye.deploy();
			deployedEyeNftContract.setStatus(2);
		});

		it("PUBLIC mint successful 1", async function () {
			await expect(deployedEyeNftContract.mint([], 1, { value: ethers.utils.parseEther("0.01") }))
				.to.emit(deployedEyeNftContract, "Transfer")
				.withArgs(ethers.constants.AddressZero, owner.address, 1);
		});

		it("PUBLIC mint successful 2", async function () {
			await expect(deployedEyeNftContract.mint([], 2, { value: ethers.utils.parseEther("0.02") }))
				.to.emit(deployedEyeNftContract, "Transfer")
				.withArgs(ethers.constants.AddressZero, owner.address, 2);
		});

		it("PUBLIC mint 3 error", async function () {
			await expect(deployedEyeNftContract.mint([], 3, { value: ethers.utils.parseEther("0.03") })).to.be.revertedWith("Minting limits exceeded");
		});

	});

	describe("UtilityFunctions", function () {
		before(async function () {
			Eye = await ethers.getContractFactory("Eye");
			[owner, addr1, addr2, ...addrs] = await ethers.getSigners();
			deployedEyeNftContract = await Eye.deploy();

			const leafNotes = whitelistAddresses.map((addr) => keccak256(addr));
			merkleTree = new MerkleTree(leafNotes, keccak256, {
				sortPairs: true,
			});

			await deployedEyeNftContract.setMerkeRoot(merkleTree.getHexRoot());
		});

		it("Set Base token uri", async function () {
			await deployedEyeNftContract.setBaseTokenURI("test");
			expect(await deployedEyeNftContract.baseTokenURI()).to.equal("test");
		});

		it("Set Withdrawal address", async function () {
			const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
			deployedEyeNftContract.setWithdrawDest1(ethers.utils.getAddress(address));
			expect(await deployedEyeNftContract.withdrawDest1()).to.equal(address);
		});

		it("Set Merkle root", async function () {
			deployedEyeNftContract.setMerkeRoot(merkleTree.getHexRoot());
			expect(await deployedEyeNftContract.merkleRoot()).to.equal(merkleTree.getHexRoot());
		});
	});
});
