/* eslint-disable no-await-in-loop */

const Web3 = require('web3');
const chalk = require('chalk');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const BigNumber = require('bignumber.js');
const inquirer = require('inquirer');
const FIFSRegistrar = require('./abi/FIFSRegistrar.json');
const RNS_ABI = require('./abi/RNS.json');
const RIF_ABI = require('./abi/RIF');
const {
  getRegisterData, getOwner, delay, getCost, makeCommitment, sendCommitment, transferAndCall, randomString,
} = require('./utils');

const rskEndpoint = 'https://public-node.testnet.rsk.co';
const defaultAddress = '0x0000000000000000000000000000000000000000';
const myWalletAddress = '0x0c50ecD06DFF8C22A9aFC80356d5d7f39921E882';

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

let domainNameToReg = '';
const secret = web3.utils.toHex(randomString(16));
const durationYear = 1;

async function main() {
  try {
    const questions = [
      {
        type: 'input',
        name: 'domainName',
        message: 'Please enter a domain name to register:',
        validate: domainName => new Promise((resolve) => {
          console.log('\nChecking domain availability ...');
          getOwner(rnsInstance, domainName)
            .then((registeredOwner) => {
              if (registeredOwner !== defaultAddress) {
                return resolve(`Domain ${domainName} has already been registered! Address at ${chalk.blue(registeredOwner)}`);
              }

              return resolve(true);
            });
        }),
      },
    ];

    const answers = await inquirer.prompt(questions);
    domainNameToReg = answers[questions[0].name];
    console.log(`${chalk.green('success ')}Domain ${domainNameToReg} is available.`);

    console.log(`Generating commitment from ${myWalletAddress} to FIFS ${fifsAddress} ...`);
    const hashCommit = await makeCommitment(fifsInstance, domainNameToReg, myWalletAddress, secret);
    console.log(`${chalk.green('success ')}Commitment hash ${hashCommit}`);

    const sendhashCommit = await sendCommitment(fifsInstance, hashCommit);
    console.log(`${chalk.green('success ')}Confirmed hash ${sendhashCommit}`);

    let isReveal = false;
    while (!isReveal) {
      // Ensure the commitment is ready to be revealed.This method can be polled to ensure registration.
      console.log('Please wait few minutes to ensure the commitment is ready to be revealed ...');
      const revealResult = await fifsInstance.methods.canReveal(hashCommit).call();
      console.log('isReveal: ', revealResult);
      // check canReveal domain every 20s
      await delay(20000);
      if (revealResult) {
        isReveal = true;
      }
    }
    const durationBN = new BigNumber(durationYear);
    const data = getRegisterData(domainNameToReg, myWalletAddress, web3.utils.toHex(secret), durationBN);
    const weiValue = await getCost(fifsInstance, domainNameToReg, durationBN);

    console.log(`Sending RIF payment ${chalk.blue(weiValue)}(wei), duration: ${chalk.blue(`${durationYear} year`)}, owner: ${myWalletAddress}, secret: ${secret} ...`);
    const transferResult = await transferAndCall(rifInstance, fifsAddress, weiValue, data);

    console.log(`${chalk.green('success ')}Payment hash ${transferResult}`);
    console.log(chalk.green(`Congratulations! Your domain name ${domainNameToReg} is now associated to address ${myWalletAddress}`));
  } catch (error) {
    console.log(error.message);
  }
}
main();

// At termination, `provider.engine.stop()' should be called to finish the process elegantly.
provider.engine.stop();
