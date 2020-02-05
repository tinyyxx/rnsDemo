const Web3 = require('web3');
const namehash = require('eth-ens-namehash');
const { keccak_256: sha3 } = require('js-sha3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const BigNumber = require('bignumber.js');
const FIFSRegistrar = require('./abi/FIFSRegistrar.json');
const RNS = require('./abi/RNS.json');
const RIF = require('./abi/RIF');
const { getRegisterData } = require('./utils');

const rskEndpoint = 'https://public-node.testnet.rsk.co';
const defaultAddress = '0x0000000000000000000000000000000000000000';
const myAddress = '0x0c50ecD06DFF8C22A9aFC80356d5d7f39921E882';
const RIFAddress = '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe';

if (process.argv.length !== 3) {
  console.error('Input must be a name');
  process.exit();
}

function getOwner(_rnsInstance, _domainName) {
  return _rnsInstance.methods.owner(namehash.hash(`${_domainName}.rsk`)).call({});
}

function delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time * 1000);
  });
}

const mnemonic = 'fabric arrest space cost embark tell pear balance title girl photo valley'; // 12 word mnemonic
const provider = new HDWalletProvider(mnemonic, rskEndpoint);


// HDWalletProvider is compatible with Web3. Use it at Web3 constructor, just like any other Web3 Provider
const web3 = new Web3(provider);

// Or, if web3 is alreay initialized, you can call the 'setProvider' on web3, web3.eth, web3.shh and/or web3.bzz
web3.setProvider(provider);

const fifsAddress = '0x36ffda909f941950a552011f2c50569fda14a169';
// const fifsInstance = new web3.eth.Contract(FIFSRegistrar, fifsAddress);
const fifsInstance = new web3.eth.Contract(
  FIFSRegistrar, fifsAddress, { from: myAddress },
);

const rnsAddress = '0x7d284aaac6e925aad802a53c0c69efe3764597b8';
const rnsInstance = new web3.eth.Contract(RNS, rnsAddress);

const domainNameToReg = process.argv[2];

getOwner(rnsInstance, domainNameToReg).then((isRegistered) => {
  if (isRegistered !== defaultAddress) {
    throw new Error('This domain has already been registered!');
  }
  return fifsInstance.methods.makeCommitment(`0x${sha3(domainNameToReg)}`, myAddress, web3.utils.toHex('azjieqw1')).call((error, hashCommit) => {
    if (error) console.error(`makeCommitment fail : ${error}`);
    console.log(hashCommit);
    return fifsInstance.methods.commit(hashCommit).send(async (_error, result) => {
      if (_error) {
        console.error('commit fail : ', _error);
      }
      console.log('commit result', result); // 0xc1c16e0cd663a25945da86da4ccc4f5c506fc4349853bd17784c6ea442d1e6f3
      await delay(60);
      const rif = new web3.eth.Contract(
        RIF, RIFAddress, { from: myAddress },
      );
      const weiValue = 2 * (10 ** 18);
      const durationBN = new BigNumber(1);
      const data = getRegisterData(domainNameToReg, myAddress, web3.utils.toHex('azjieqw1'), durationBN);
      rif.methods.transferAndCall(fifsAddress, weiValue.toString(), data).send((tranferError, transferResult) => {
        console.warn(`rif.methods.transferAndCall(${fifsAddress}, ${weiValue.toString()}, ${data}) ==> return`, transferResult);
        if (tranferError) {
          console.error(tranferError);
        }
        console.log(result);
      });
    });
  });
}).catch((err) => {
  console.error(err.message);
});


provider.engine.stop();
