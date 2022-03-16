const { ethers } = require("hardhat");
let { networkConfig } = require('../helper-hardhat-config')

module.exports = async({
    getNamedAccounts,
    deployments,
    getChainId
}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const chainId = await getChainId()

    log("---------------------------------------")
    const EYENFT = await deploy("Eye", {
        from: deployer,
        log: true
    })

    log(`contract deployed to ${EYENFT.address}`)


    const eyeContract = await ethers.getContractFactory("Eye")
    //hre - hardhat runtime environment - 
    const accounts = await hre.ethers.getSigners()
    const signer = accounts[0]
    const eyesNFT = new ethers.Contract(EYENFT.address, eyeContract.interface, signer)
    const networkName = networkConfig[chainId]['name']

    log(`Verify with:\n npx hardhat verify --network ${networkName} ${eyesNFT.address}`)
    log("Let's create an NFT now!")
    log(`You've made your first NFT!`)
    // log(`You can view the tokenURI here ${await eyesNFT.tokenURI(1)}`)

}
    
module.exports.tags = ["all", "svg"]