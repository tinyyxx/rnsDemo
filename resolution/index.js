import Web3 from 'web3';
import RNS from '@rsksmart/rns';

const web3 = new Web3('https://public-node.testnet.rsk.co');
const rns = new RNS(web3);

// query domain address
// rns.addr('tinyyxx12.rsk').then(console.log);

// Set resolver of a given domain
// rns.setResolver('multichain.testing.rsk', '0x0000000000000000000000000000000000000001').then(console.log);

// set address resolution
// rns.setAddr('tinyyxx12.rsk', '0x0000000000000000000000000000000000000001').then(console.log);

// set bitcoin address resolution
rns.setAddr('tinyyxx12.rsk', '0x0000000000000000000000000000000000000001', '0x80000000').then(console.log);
