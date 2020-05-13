import Web3 from 'web3';
import RNS from '@rsksmart/rns';
import HDWalletProvider from '@truffle/hdwallet-provider';

const rskEndpoint = 'https://public-node.testnet.rsk.co';
const mnemonic = 'fabric arrest space cost embark tell pear balance title girl photo valley'; // 12 word mnemonic
const provider = new HDWalletProvider(mnemonic, rskEndpoint);

// HDWalletProvider is compatible with Web3. Use it at Web3 constructor, just like any other Web3 Provider
const web3 = new Web3(provider);

const rns = new RNS(web3);
// query domain address
// rns.addr('tinyyxx12.rsk').then(console.log);

// Set resolver of a given domain
// rns.setResolver('tinyyxx12.rsk', '0x404308f2a2eec2cdc3cb53d7d295af11c903414e').then(console.log);

// set address resolution
// rns.setAddr('tinyyxx12.rsk', '0x55d6abcaecf88d438aecf32e38b8ab2466fab737').then(console.log);

// set bitcoin address resolution
rns.setAddr('tinyyxx12.rsk', '0x0000000000000000000000000000000000000001', '0x80000000').then(console.log);
