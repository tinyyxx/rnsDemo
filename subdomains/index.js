import Web3 from 'web3';
import RNS from '@rsksmart/rns';

const web3 = new Web3('https://public-node.testnet.rsk.co');
const rns = new RNS(web3);


// Register a subdomain
// rns.subdomains.create('tinyyxx12.rsk', 'rwallet', '0x55d6AbCaECf88d438AEcF32E38B8aB2466fAb737', '0x55d6AbCaECf88d438AEcF32E38B8aB2466fAb737').then(console.log);

// change subdomain's owner
rns.subdomains.setOwner('tinyyxx12.rsk', 'rwallet', '0x55d6AbCaECf88d438AEcF32E38B8aB2466fAb737');