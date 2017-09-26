const fs = require('fs');
const util = require('util');
const ProviderEngine = require('web3-provider-engine');
const Wallet = require('ethereumjs-wallet');
const WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
const Web3Subprovider = require('web3-provider-engine/subproviders/web3.js');
const Web3 = require('web3');


// we load the wallet and tell the web3.js how to connect to ethereum and that it should use our wallet
let engine = new ProviderEngine();
let walletPath  = './wallet.json';
let walletPassword = 'password';
if (!fs.existsSync(walletPath)) {
  let wallet = Wallet.generate();
  let content = JSON.stringify(wallet.toV3(walletPassword));
  fs.writeFileSync(walletPath, content);
}
let walletJson  = fs.readFileSync(walletPath);
let wallet      = Wallet.fromV3(JSON.parse(walletJson), walletPassword);

let providerUrl = 'http://localhost:8545';
let walletAddress = '0x' + wallet.getAddress().toString('hex');

console.log("our address: " + walletAddress);

engine.addProvider(new WalletSubprovider(wallet, {}));
engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl)));
engine.start();

let web3 = new Web3(engine);
web3.eth.defaultAccount = walletAddress;

// setup done. now we can use web3 to interact with the ethereum network


// let's see how much ETH is in our wallet
web3.eth.getBalance(walletAddress, function(err, balance) {
  console.log('wallet balance: ' + web3.fromWei(balance).toString() + 'ETH');
})


// we want to interact with a contract, so let's initialize a contract object from the ABI
let contractMetadata = JSON.parse(fs.readFileSync('./contract-metadata.js'));
let contract = web3.eth.contract(contractMetadata.abi).at(contractMetadata.address);

// the contract object now has functions for all our public contract functions

// read the exchange rate
contract.exchangeRate(function(e, rate) {
  console.log(`current exchange rate: ${rate.toString()}`);
});
// read the oracle address
contract.oracle(function(err, oracle) {
  console.log(`configured oracle: ${oracle}`);
});

// call a function to change the exchange rate. publishes a transaction - costs gas.
contract.setExchangeRate(1000, function(e, response) {
  if(e) {
    console.log(e);
  }
  console.log(response);
});


