import chalk from 'chalk';
import Web3 from 'web3';
import {
  getRegisterData, getOwner, delay, randomString,
} from './utils';

const inquirer = require('inquirer');

const { keccak_256: sha3 } = require('js-sha3');
const HDWalletProvider = require('@truffle/hdwallet-provider');

/**
 * Smart Contract ABIs
 */
const FIFS_ABI = require('./abi/FIFSRegistrar.json');
const RNS_ABI = require('./abi/RNS.json');
const RIF_ABI = require('./abi/RIF');

/**
 * Constants
 */
const RSK_ENDPOINT = 'https://public-node.testnet.rsk.co';
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const FIFS_ADDRESS = '0x36ffda909f941950a552011f2c50569fda14a169';
const RIF_ADDRESS = '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe';
const RNS_ADDRESS = '0x7d284aaac6e925aad802a53c0c69efe3764597b8';

/**
 * Variables: keep them as-is or change to your own
 */
const walletAddress = '0x0c50ecD06DFF8C22A9aFC80356d5d7f39921E882';
const mnemonic = 'fabric arrest space cost embark tell pear balance title girl photo valley'; // 12 word phrase mnemonic

/**
 * Promisify makeCommitment call
 * @param {*} fifsInstance fifsInstance
 * @param {*} domainNameToRegister domainNameToRegister
 * @param {*} address address
 * @param {*} data data
 */
async function makeCommitment(fifsInstance, domainNameToRegister, address, data) {
  return new Promise((resolve, reject) => {
    fifsInstance.methods.makeCommitment(`0x${sha3(domainNameToRegister)}`, address, data)
      .call((error, hashCommit) => {
        if (error) {
          return reject(error);
        }

        return resolve(hashCommit);
      });
  });
}

/**
 * Promisify commitment call
 * @param {*} fifsInstance fifsInstance
 * @param {*} domainNameToRegister domainNameToRegister
 * @param {*} address address
 * @param {*} data data
 */
async function sendCommitment(fifsInstance, commitmentHash) {
  return new Promise((resolve, reject) => {
    fifsInstance.methods.commit(commitmentHash)
      .send(async (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      });
  });
}

/**
 *
 * @param {*} param0
 */
async function makeRIFPayment({
  rifInstance, to, value, data,
}) {
  return new Promise((resolve, reject) => {
    rifInstance.methods.transferAndCall(to, value, data).send((error, result) => {
      if (error) {
        return reject(error);
      }

      return resolve(result);
    });
  });
}

/**
 * Main entrance
 */
async function main() {
  try {
    const web3 = new Web3(new HDWalletProvider(mnemonic, RSK_ENDPOINT));
    const fifsInstance = new web3.eth.Contract(FIFS_ABI, FIFS_ADDRESS, { from: walletAddress });
    const rnsInstance = new web3.eth.Contract(RNS_ABI, RNS_ADDRESS);
    const rifInstance = new web3.eth.Contract(RIF_ABI, RIF_ADDRESS, { from: walletAddress });

    const questions = [
      {
        type: 'input',
        name: 'domainName',
        message: 'Please enter a domain name to register:',
        validate: (domainName) => new Promise((resolve) => {
          console.log('\nChecking domain availability ...');
          getOwner(rnsInstance, domainName)
            .then((registeredOwner) => {
              if (registeredOwner !== NULL_ADDRESS) {
                return resolve(`Domain ${domainName} has already been registered! Address at ${chalk.blue(registeredOwner)}`);
              }

              return resolve(true);
            });
        }),
      },
    ];

    const answers = await inquirer.prompt(questions);
    const domainName = answers[questions[0].name];
    console.log(`${chalk.green('success ')}Domain ${domainName} is available.`);

    console.log(`Generating commitment from ${walletAddress} to FIFS ${FIFS_ADDRESS} ...`);

    // Generate a random 16 letter string as secrete
    const secret = web3.utils.toHex(randomString(16));

    const commitmentResult = await makeCommitment(fifsInstance, `0x${sha3(domainName)}`, walletAddress, secret);
    console.log(`${chalk.green('success ')}Commitment hash ${commitmentResult}`);

    console.log(`Making commitment to FIFS with hash ${commitmentResult} ...`);

    const sendResult = await sendCommitment(fifsInstance, commitmentResult);
    console.log(`${chalk.green('success ')}Confirmed hash ${sendResult}`);

    // wait 1 sec according to docs https://developers.rsk.co/rif/rns/architecture/rsk-registrar/registrars/fifs/
    await delay(5000);

    const value = (2 * (10 ** 18)).toString();
    const registerParams = {
      name: domainName,
      owner: walletAddress,
      secret,
      duration: 1, // Register length in years
    };

    const data = getRegisterData(registerParams);

    console.log(`Sending RIF payment ${chalk.blue(value)}(wei), duration: ${chalk.blue(`${registerParams.duration} year`)}, owner: ${registerParams.owner}, secret: ${registerParams.secret} ...`);

    const paymentResult = await makeRIFPayment({
      rifInstance,
      to: FIFS_ADDRESS,
      value,
      data,
    });

    console.log(`${chalk.green('success ')}Payment hash ${paymentResult}`);
    console.log(chalk.green(`Congratulations! Your domain name ${domainName} is now associated to address ${registerParams.owner}`));
  } catch (ex) {
    console.error(ex);
  }
}

main();