import Web3 from 'web3';
import RNS from '@rsksmart/rns';
import HDWalletProvider from '@truffle/hdwallet-provider';

const rskEndpoint = 'https://public-node.testnet.rsk.co';
const mnemonic = 'fabric arrest space cost embark tell pear balance title girl photo valley'; // 12 word mnemonic
const provider = new HDWalletProvider(mnemonic, rskEndpoint);

// HDWalletProvider is compatible with Web3. Use it at Web3 constructor, just like any other Web3 Provider
const web3 = new Web3(provider);

const rns = new RNS(web3);

// Register a subdomain
// rns.subdomains.create('tinyyxx12.rsk', 'rwallet', '0x55d6abcaecf88d438aecf32e38b8ab2466fab737', '0x55d6abcaecf88d438aecf32e38b8ab2466fab737').then(console.log);

// change subdomain's owner
rns.subdomains.setOwner('tinyyxx12.rsk', 'test', '0x0c50ecd06dff8c22a9afc80356d5d7f39921e882').then(console.log);
