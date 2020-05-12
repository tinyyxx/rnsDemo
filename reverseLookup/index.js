import Web3 from 'web3';
import RNS from '@rsksmart/rns';

const web3 = new Web3('https://public-node.testnet.rsk.co');
const rns = new RNS(web3);


// set reverse
rns.setReverse('rwallet1.rsk').then(console.log);


// Find the name of an address
// rns.reverse('0x0C50Ecd06Dff8C22A9afc80356D5D7F39921e82').then(console.log);
