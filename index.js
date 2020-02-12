const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const BigNumber = require('bignumber.js');
const FIFSRegistrar = require('./abi/FIFSRegistrar.json');
const RNS_ABI = require('./abi/RNS.json');
const RIF_ABI = require('./abi/RIF');
const {
  getRegisterData, getOwner, delay, getCost, makeCommitment, sendCommitment, transferAndCall, randomString
} = require('./utils');

const rskEndpoint = 'https://public-node.testnet.rsk.co';
const defaultAddress = '0x0000000000000000000000000000000000000000';
const myWalletAddress = '0x0c50ecD06DFF8C22A9aFC80356d5d7f39921E882';

if (process.argv.length !== 3) {
  console.error('Please input the domain name you want to register!');
  process.exit();
}

const mnemonic = 'fabric arrest space cost embark tell pear balance title girl photo valley'; // 12 word mnemonic
const provider = new HDWalletProvider(mnemonic, rskEndpoint);

// HDWalletProvider is compatible with Web3. Use it at Web3 constructor, just like any other Web3 Provider
const web3 = new Web3(provider);

const fifsAddress = '0x36ffda909f941950a552011f2c50569fda14a169';
const fifsInstance = new web3.eth.Contract(
  FIFSRegistrar, fifsAddress, { from: myWalletAddress },
);

const rnsAddress = '0x7d284aaac6e925aad802a53c0c69efe3764597b8';
const rnsInstance = new web3.eth.Contract(RNS_ABI, rnsAddress);

const rifAddress = '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe';
const rifInstance = new web3.eth.Contract(RIF_ABI, rifAddress, { from: myWalletAddress });

const domainNameToReg = process.argv[2];
const secret = web3.utils.toHex(randomString(16));
const durationYear = 1;

async function main() {
  try {
    const isRegister = await getOwner(rnsInstance, domainNameToReg);
    if (isRegister !== defaultAddress) {
      throw new Error('This address is already been registered.');
    }
    const hashCommit = await makeCommitment(fifsInstance, domainNameToReg, myWalletAddress, secret);
    console.log('makeCommitment result: ', hashCommit);
    const sendhashCommit = await sendCommitment(fifsInstance, hashCommit);
    console.log('sendCommitment result: ', sendhashCommit);

    let isReveal = false;
    while (!isReveal) {
      // eslint-disable-next-line no-await-in-loop
      const revealResult = await fifsInstance.methods.canReveal(hashCommit).call();
      console.log('isReveal: ', revealResult);
      // check canReveal domain every 20s
      // eslint-disable-next-line no-await-in-loop
      await delay(20000);
      if (revealResult) {
        isReveal = true;
      }
    }
    const durationBN = new BigNumber(durationYear);
    const data = getRegisterData(domainNameToReg, myWalletAddress, web3.utils.toHex(secret), durationBN);
    const weiValue = await getCost(fifsInstance, domainNameToReg, durationBN);

    const transferResult = await transferAndCall(rifInstance, fifsAddress, weiValue, data);

    console.log('transferAndCall succress: ', transferResult);
  } catch (error) {
    console.log(error.message());
  }
}
main();

provider.engine.stop();
