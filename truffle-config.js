
const HDWalletProvider = require("@truffle/hdwallet-provider");
const privateKey =
  "91218c9ef59fe4ae8fda0cb0c8086756191f311850e673721822dcabce1c99c9";
  const polygon = "https://rpc-mumbai.maticvigil.com";

module.exports = {
 
  networks: {
    polygon: {
      provider: () => new HDWalletProvider(privateKey, polygon),
      gasPrice: 0,
      network_id: "*",
      chainId:80001,
      skipDryRun: true,
      networkCheckTimeout: 600000
    },
    //  development: {
    //  host: "127.0.0.1",     // Localhost (default: none)
    //  port: 8545,            // Standard Ethereum port (default: none)
    //  network_id: "*",       // Any network (default: none)
    // }
    
  },
  mocha:{
    // timeout: 100000
  },

  compilers: {
    solc: {
      version: "^0.5.16",    // Fetch exact version from solc-bin (default: truffle's version)
    }
  },

 // plugins: ["truffle-contract-size"],
  // $ truffle migrate --reset --compile-all

  db: {
    enabled: false
  }
};
