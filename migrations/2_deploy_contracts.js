const bit = artifacts.require("Bitspawn");
const ErcTest = artifacts.require("ErcTest");

module.exports = function (deployer) {
  
  deployer.deploy(bit).then(() => { return deployer.deploy(ErcTest, bit.address,"0x8AF41Cacb5FE289587292BA3c7eaa4a65b383c80") });

};
