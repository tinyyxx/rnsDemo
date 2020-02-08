import { randomBytes /* createHash */ } from 'crypto';

const web3 = require('web3');
const namehash = require('eth-ens-namehash');


function numberToUint32(number) {
  const hexDuration = web3.utils.numberToHex(number);
  let result = '';
  for (let i = 0; i < 66 - hexDuration.length; i += 1) {
    result += '0';
  }
  result += hexDuration.slice(2);
  return result;
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
function getRegisterData({
  name: rawName, owner: rawOwner, secret: rawSecret, duration: rawDuration,
}) {
  // 0x + 4 bytes
  const signature = '0xc2c414c8';

  // 20 bytes
  const owner = rawOwner.toLowerCase().slice(2);

  // 32 bytes
  let secret = rawSecret.slice(2);
  const padding = 64 - secret.length;
  for (let i = 0; i < padding; i += 1) {
    secret += '0';
  }

  // 32 bytes
  const duration = numberToUint32(rawDuration);

  // variable length
  const name = utf8ToHexString(rawName);

  return `${signature}${owner}${secret}${duration}${name}`;
}

function getRenewData(rawName, rawDuration) {
  // 0x + 4 bytes
  const signature = '0x14b1a4fc';

  // 32 bytes
  const duration = numberToUint32(rawDuration);

  // variable length
  const name = utf8ToHexString(rawName);

  return `${signature}${duration}${name}`;
}

/**
 * registration with rif transferAndCall encoding
 * @param {string} name to register
 * @param {address} owner of the new name
 * @param {hex} secret of the commit
 * @param {BN} duration to register in years
 */
function getAddrRegisterData({
  name: rawName, owner: rawOwner, secret: rawSecret, duration: rawDuration, address,
}) {
  // 0x + 8 bytes
  const signature = '0x5f7b99d5';

  // 20 bytes
  const owner = rawOwner.toLowerCase().slice(2);

  // 32 bytes
  let secret = rawSecret.slice(2);
  const padding = 64 - secret.length;
  for (let i = 0; i < padding; i += 1) {
    secret += '0';
  }

  // 32 bytes
  const duration = numberToUint32(rawDuration);

  // variable length
  const name = utf8ToHexString(rawName);

  // 20 bytes
  const addr = address.toLowerCase().slice(2);

  return `${signature}${owner}${secret}${duration}${addr}${name}`;
}

function getOwner(_rnsInstance, _domainName) {
  return _rnsInstance.methods.owner(namehash.hash(`${_domainName}.rsk`)).call({});
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

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

module.exports = {
  getRegisterData,
  getRenewData,
  getAddrRegisterData,
  getOwner,
  delay,
  randomString,
};
