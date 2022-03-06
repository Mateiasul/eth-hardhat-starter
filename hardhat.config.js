require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require('dotenv').config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL || "https://eth-rinkeby.alchemyapi.io/v2/your-api-key"
const MNEMONIC = process.env.MNEMONIC || "your mnemonic"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Your etherscan API key"

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  defaultNetwork: "hardhat",
  networks: {
      hardhat: {

          // // If you want to do some forking, uncomment this
          // forking: {
          //   url: MAINNET_RPC_URL
          // }
      },
      localhost: {
      },
      rinkeby: {
          url: RINKEBY_RPC_URL,
          // accounts: [PRIVATE_KEY],
          accounts: {
              mnemonic: MNEMONIC,
          },
          saveDeployments: true,
      },
      polygon: {
          url: "https://rpc-mainnet.maticvigil.com/",
          // accounts: [PRIVATE_KEY],
          accounts: {
              mnemonic: MNEMONIC,
          },
          saveDeployments: true,
      },
  },
  etherscan: {
      apiKey: ETHERSCAN_API_KEY
  },
  namedAccounts: {
    deployer: {
        default: 0, // here this will by default take the first account as deployer
        1: 0 // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    feeCollector: {
        default: 1
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.1",
      },
      {
        version: "0.8.0",
      },
    ],
  }
}
