require("dotenv").config();

const Web3 = require("web3");
const Tx = require("ethereumjs-tx").Transaction;
const fs = require("fs");
var mqtt = require("mqtt");

let web3 = new Web3(Web3.givenProvider || process.env.INFURA_PATH);
var client = mqtt.connect(process.env.MQTT_HOST, {
  port: 1883,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
});

var abi = fs.readFileSync("./WaterContract.json", {
  encoding: "utf8",
  flag: "r",
});
abi = JSON.parse(abi);
abi = abi["abi"];

var address = process.env.WALLET_ADDRESS;
const contractAddress = process.env.WATER_CONTRACT_ADDRESS;
const privateKey1 = Buffer.from(
  process.env.PRIVATE_KEY,
  "hex"
);

waterInstance = new web3.eth.Contract(abi, address);
console.log(waterInstance.methods);

const contract = new web3.eth.Contract(abi, contractAddress);

web3.eth.getTransactionCount(address, (err, txCount) => {
  const txObject = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(800000), // Raise the gas limit to a much higher amount
    gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
    to: contractAddress,
    data: contract.methods.triggerWatering(20, process.env.DAO_REGISTRY).encodeABI(),
  };

  const tx = new Tx(txObject, {chain:'rinkeby'});
  tx.sign(privateKey1);

  const serializedTx = tx.serialize();
  const raw = "0x" + serializedTx.toString("hex");

  web3.eth.sendSignedTransaction(raw, (err, txHash) => {
    console.log("err:", err, "txHash:", txHash);
  });
});