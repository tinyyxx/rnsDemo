import Web3 from 'web3';
import RNS from '@rsksmart/rns';
import HDWalletProvider from '@truffle/hdwallet-provider';

const rskEndpoint = 'https://public-node.testnet.rsk.co';
const mnemonic = 'fabric arrest space cost embark tell pear balance title girl photo valley'; // 12 word mnemonic
const provider = new HDWalletProvider(mnemonic, rskEndpoint);

// HDWalletProvider is compatible with Web3. Use it at Web3 constructor, just like any other Web3 Provider
const web3 = new Web3(provider);

const rns = new RNS(web3);


// set reverse
// rns.setReverse('rwallet3.rsk').then(console.log);


// Find the name of an address
rns.reverse('0x0c50ecD06DFF8C22A9aFC80356d5d7f39921E882').then(console.log);
