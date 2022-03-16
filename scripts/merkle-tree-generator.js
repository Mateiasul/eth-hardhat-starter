const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

const whitelistAddresses = [
    "0x1C6400F556e80bCD7B977021b7fEe42FBdd18739",
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
]

const leafNotes = whitelistAddresses.map(addr => keccak256(addr));
const mrkleTree = new MerkleTree(leafNotes, keccak256, { sortPairs: true })
console.log(mrkleTree.toString());

const claimingAddress = leafNotes[0];
const proof = mrkleTree.getHexProof(claimingAddress);
console.log(proof,'proof')
