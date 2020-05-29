/* eslint-disable no-await-in-loop */
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const rskEndpoint = 'https://public-node.testnet.rsk.co';

const mnemonic = 'fabric arrest space cost embark tell pear balance title girl photo valley'; // 12 word mnemonic
const provider = new HDWalletProvider(mnemonic, rskEndpoint, 0, 1, false, "m/44'/37310'/0'/0/0");

// HDWalletProvider is compatible with Web3. Use it at Web3 constructor, just like any other Web3 Provider
const web3 = new Web3(provider);

const faucetAddress = web3.utils.toChecksumAddress('0x248B320687eBf655f9eE7F62F0388c79fBB7b2F4');
const myWalletAddress = web3.utils.toChecksumAddress('0x51F85355eFC8559B6325d9cC249080Beb9D2bfd5');

const faucet = new web3.eth.Contract([
  {
    constant: false,
    inputs: [
      {
        name: 'to',
        type: 'address',
      },
    ],
    name: 'dispense',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0x5f746233',
  },
], faucetAddress);

async function main() {
  try {
    faucet.methods.dispense(myWalletAddress).send({ from: myWalletAddress })
      .on('transactionHash', (hash) => console.log(hash))
      .catch((error) => console.log(error));
  } catch (error) {
    console.log(error.message);
  }
}
main();

// At termination, `provider.engine.stop()' should be called to finish the process elegantly.
provider.engine.stop();
