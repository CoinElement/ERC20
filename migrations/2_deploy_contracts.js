const bit = artifacts.require("Bitspawn");
const ErcTest = artifacts.require("ErcTest");

module.exports = function (deployer) {
  
  deployer.deploy(bit).then(() => { return deployer.deploy(ErcTest, bit.address) });

};
