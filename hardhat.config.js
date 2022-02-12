/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config();
require('@nomiclabs/hardhat-ethers');
const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.11",
  defaultNetwork:"ropsten",
  networks:{
    hardhat:{},
    ropsten:{
      url:API_URL,
      accounts:[`0x${PRIVATE_KEY}`]
    },
    testnet: {
      url: `https://api.s0.b.hmny.io`,
      accounts:[`0x${PRIVATE_KEY}`]
    },
    mainnet: {
      url: `https://api.harmony.one`,
      accounts:[`0x${PRIVATE_KEY}`]
    }
  },
};
