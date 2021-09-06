const bit = artifacts.require("Bitspawn");
const ErcTest = artifacts.require("ErcTest");

const owner = "0x8AF41Cacb5FE289587292BA3c7eaa4a65b383c80";
module.exports = function (deployer) {
  
  try{
    deployer.deploy(bit).then(() => { return deployer.deploy(ErcTest, bit.address,owner) });
  }
  catch(e){
    console.log(e);
  }
  

};
