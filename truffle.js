/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
const HDWalletProvider = require("truffle-hdwallet-provider");

require('dotenv').config();

const mnemonic = process.env.HDW_MNEMONIC;
const infuraKey = process.env.INFURA_API_KEY

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() { 
        return new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${infuraKey}`) 
      },
      network_id: '3',
      gas: 4500000,
      gasPrice: 10000000000,
    },
   
  }
};
