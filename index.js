require('dotenv').config();

const Web3 = require('web3');
const fs = require('fs');

let web3 = new Web3(Web3.givenProvider || process.env.INFURA_PATH);

var abi = fs.readFileSync('./WaterContract.json', {encoding:'utf8', flag:'r'});
abi = JSON.parse(abi);
abi = abi['abi'];

var address = process.env.WATER_CONTRACT_ADDRESS;

waterInstance = new web3.eth.Contract(abi, address);
console.log(waterInstance.methods);
waterInstance.methods.triggerWatering(20, process.env.DAO_REGISTRY).call({from: '0x9fF75B8e1D6A783c2De4535E46d986dbeB09CC31'})
.then(function(receipt){
  console.log(receipt)
});