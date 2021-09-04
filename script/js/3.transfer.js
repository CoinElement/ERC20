var Web3 = require("web3");
var Tx = require('ethereumjs-tx');

const fs = require('fs');
// const infuraKey = fs.readFileSync("./test/bob.infuraKey").toString().trim();
var web3 = new Web3(new Web3.providers.HttpProvider(`https://rpc-mumbai.maticvigil.com`));

//读取num属性
async function transferFrom(contractObj,fromAddr,toAddr,amount) {
    //var approve= await contractObj.methods.approve(toAddr,amount).call();
   // let myValue = await contractObj.methods.transferFrom(fromAddr,toAddr,amount).call();
    console.log(fromAddr+"  ------>  "+toAddr+"  Amount: ",amount);
}

function getPriKey(prikeyPath) {
    const privKeyFile = fs.readFileSync(prikeyPath).toString().trim();
    const privKey = new Buffer.from(privKeyFile, 'hex');    
    return privKey
}


function sendSigned(txData, cb) {
    const privateKey = new Buffer.from(privKey, 'hex')
    const transaction = new Tx(txData)
    transaction.sign(privateKey)
    const serializedTx = transaction.serialize().toString('hex')
    web3.eth.sendSignedTransaction('0x' + serializedTx, cb)
}

function getEthRawTx(fromAddress,contractAddress,toAddress,contractObj,_tokenAmount,nonceNum,privKey) {
    //raw Tx
    var rawTransaction = {
        "from": fromAddress,
        "nonce": web3.utils.toHex(nonceNum),
        "gasLimit": web3.utils.toHex(6000000),
        "gasPrice": web3.utils.toHex(10e9),
        "to": contractAddress,
        "value": web3.utils.toHex(0),
        "data": contractObj.methods.transferFrom(fromAddress,toAddress,_tokenAmount).encodeABI(),  //设置num属性
        "chainId": 80001 //4:Rinkeby, 3:Ropsten, 1:mainnet, 80001:polygon testnet
    };

    var tx = new Tx(rawTransaction);
    tx.sign(privKey);
    var serializedTx = tx.serialize();
    return serializedTx;
}

async function signTransaction(fromAddress,contractAddress,toAddress,contractObj,_tokenAmount,nonceNum, privKey) {
    var serializedTx = getEthRawTx(fromAddress,contractAddress,toAddress,contractObj,_tokenAmount,nonceNum, privKey)

    // Comment out these three lines if you don't really want to send the TX right now
    console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}`);
    var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    console.log(`Receipt info:  ${JSON.stringify(receipt, null, '\t')}`);
}

function sleep(delay) {
    return new Promise(reslove => {
      setTimeout(reslove, delay)
    })
}

const TokenTransfer = async (_fromAddress,_toAddress,_amount) => {
    //主账户地址
    var fromAddress = "0x8AF41Cacb5FE289587292BA3c7eaa4a65b383c80";
    
    //bob合约的abi
    var contractAbi = fs.readFileSync("../abi/DSTokenBase.json","utf-8");

    // bob合约地址
    var contractAddress = "0x9Eb01347e477EF1B630F7B499AE74A1a2d35F1f7";
    
    // get the nonce
    var nonceCnt = await web3.eth.getTransactionCount(fromAddress);
    console.log(`num transactions so far: ${nonceCnt}`);

    //通过ABI和地址获取已部署的合约对象
    var contract = new web3.eth.Contract(JSON.parse(contractAbi), contractAddress,{from:_fromAddress});

    //await getBalance(contract,fromAddress);

    const privkey = getPriKey("../keys/edgekey")
    await signTransaction(_fromAddress,contractAddress,_toAddress,contract,_amount,nonceCnt, privkey)

    sleep(100) //100ms

    console.log("after transfer");
    await transferFrom(contract,_fromAddress,_toAddress,_amount);
    
}


var args = process.argv.splice(2)
console.log(args);

TokenTransfer(args[0],args[1],args[2])
    .then((value) => {
        console.log(value);
        // expected output: "Success!"
        })
    .catch((error) => {
        console.log(error);
        // expected output: "Success!"
    });

