const Rsk3 = require('@rsksmart/rsk3');
const RNS = require('@rsksmart/rns');

const rsk3 = new Rsk3('https://public-node.testnet.rsk.co', null, { privateKey: 'L2j44B6jFY4aPaxaNvZ1H8HHLYgnLzLQaB6FRjzabgfrr9eiirSD' });

rsk3.getAccounts().then(console.log);

const rns = new RNS(rsk3);

rns.addr('alice.rsk').then(console.log);
