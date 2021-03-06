const web3 = require('web3');
const namehash = require('eth-ens-namehash');
const { keccak_256: sha3 } = require('js-sha3');
const { randomBytes } = require('crypto');

function numberToUint32(number) {
  const hexDuration = web3.utils.numberToHex(number);
  let _duration = '';
  for (let i = 0; i < 66 - hexDuration.length; i++) {
    _duration += '0';
  }
  _duration += hexDuration.slice(2);
  return _duration;
}

function utf8ToHexString(string) {
  return string ? web3.utils.asciiToHex(string).slice(2) : '';
}

/**
 * registration with rif transferAndCall encoding
 * @param {string} name to register
 * @param {address} owner of the new name
 * @param {hex} secret of the commit
 * @param {BN} duration to register in years
 */
function getRegisterData(name, owner, secret, duration) {
  // 0x + 4 bytes
  const _signature = '0xc2c414c8';

  // 20 bytes
  const _owner = owner.toLowerCase().slice(2);

  // 32 bytes
  let _secret = secret.slice(2);
  const padding = 64 - _secret.length;
  for (let i = 0; i < padding; i++) {
    _secret += '0';
  }

  // 32 bytes
  let _duration = numberToUint32(duration);

  // variable length
  const _name = utf8ToHexString(name);

  return `${_signature}${_owner}${_secret}${_duration}${_name}`;
}

function getRenewData(name, duration) {
  // 0x + 4 bytes
  const _signature = '0x14b1a4fc';

  // 32 bytes
  _duration = numberToUint32(duration);

  // variable length
  const _name = utf8ToHexString(name);

  return `${_signature}${_duration}${_name}`;
}

/**
 * registration with rif transferAndCall encoding
 * @param {string} name to register
 * @param {address} owner of the new name
 * @param {hex} secret of the commit
 * @param {BN} duration to register in years
 */
function getAddrRegisterData(name, owner, secret, duration, addr) {
  // 0x + 8 bytes
  const _signature = '0x5f7b99d5';

  // 20 bytes
  const _owner = owner.toLowerCase().slice(2);

  // 32 bytes
  let _secret = secret.slice(2);
  const padding = 64 - _secret.length;
  for (let i = 0; i < padding; i++) {
    _secret += '0';
  }

  // 32 bytes
  _duration = numberToUint32(duration);

  // variable length
  const _name = utf8ToHexString(name);

  // 20 bytes
  _addr = addr.toLowerCase().slice(2);

  return `${_signature}${_owner}${_secret}${_duration}${_addr}${_name}`;
}

function getOwner(_rnsInstance, _domainName) {
  return _rnsInstance.methods.owner(namehash.hash(`${_domainName}.rsk`)).call();
}

function delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

/**
 * Calculates the price of a name, denominated in RIF.
 * @param {web3 contract} fifsInstance to perform abi method
 * @param {string} domain to register
 * @param {BN} duration to register in years
 * @returns {Promise<string>} price of registration
 */
function getCost(fifsInstance, domain, duration) {
  return new Promise(((resolve) => {
    fifsInstance.methods.price(domain, 0, duration).call((err, cost) => {
      if (err) return resolve(err);
      return resolve(cost);
    });
  }));
}

// Returns a new random alphanumeric string of the given size.
//
// Note: to simplify implementation, the result has slight modulo bias,
// because chars length of 62 doesn't divide the number of all bytes
// (256) evenly. Such bias is acceptable for most cases when the output
// length is long enough and doesn't need to be uniform.
function randomString(size, charRange) {
  if (size === 0) {
    throw new Error('Zero-length randomString is useless.');
  }

  const chars = charRange || ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    + 'abcdefghijklmnopqrstuvwxyz'
    + '0123456789');

  let objectId = '';
  const bytes = randomBytes(size);
  for (let i = 0; i < bytes.length; i += 1) {
    objectId += chars[bytes.readUInt8(i) % chars.length];
  }
  return objectId;
}

/**
 *  Create a commitment for register action
 * @param {web3 contract} fifsInstance to perform abi method
 * @param {string} domain to register
 * @param {address} address of new name owner
 * @param {string} secret generated by randomString method
 * @returns {Promise<string>} commitment hash
 */
function makeCommitment(fifsInstance, domain, address, secret) {
  return new Promise((resolve, reject) => {
    fifsInstance.methods.makeCommitment(`0x${sha3(domain)}`, address, web3.utils.toHex(secret)).call((err, hashCommit) => {
      if (err) return reject(err);
      return resolve(hashCommit);
    });
  });
}

/**
 * Commit before registering a name
 * @param {web3 contract} fifsInstance to perform abi method
 * @param {hex} hashCommit return from makeCommitment method
 * @returns {Promise<string>}
 */
function sendCommitment(fifsInstance, hashCommit) {
  return new Promise((resolve, reject) => {
    fifsInstance.methods.commit(hashCommit).send((err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
}

/**
 * Perform a RIF token transfer and domain registration in a single transaction
 * @param {web3 contract} rnsInstance to perform abi method
 * @param {web3 contract} fifsInstance to perform abi method
 * @param {string} weiValue calculated by getCost method
 * @param {string} encoding data from getRegisterData method
 * @returns {Promise<string>}
 */
function transferAndCall(rifInstance, fifsAddress, weiValue, data) {
  return new Promise(((resolve, reject) => {
    rifInstance.methods.transferAndCall(fifsAddress, weiValue.toString(), data).send((err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  }));
}

module.exports = {
  getRegisterData,
  getRenewData,
  getAddrRegisterData,
  getOwner,
  delay,
  getCost,
  makeCommitment,
  sendCommitment,
  transferAndCall,
  randomString,
};
