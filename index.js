const Web3 = require('web3')
const FIFSRegistrar = require('./abi/FIFSRegistrar.json')
const RNS = require('./abi/RNS.json')
const namehash = require('eth-ens-namehash')

const rskEndpoint = 'http://localhost:9545' // 'https://public-node.testnet.rsk.co'
const defaultAddress = "0x0000000000000000000000000000000000000000"
const myAddress = '0x9786c23d03fe17552f23fd6da5c2b7f0330e015a'
const mySecret = '9E41AA4BA98146F04039E7974A83BF65A8494D2F27D5CAB32F18650A514AFBEF'
let web3 = new Web3(rskEndpoint)

const fifsAddress =  '0x681BF2960161e21B891C59c9f8463d711c31d180' //'0x36ffda909f941950a552011f2c50569fda14a169'
const fifsInstance = new web3.eth.Contract(FIFSRegistrar, fifsAddress)

let rnsAddress = '0xdc0388F6B37111c96718c963309A43B684Bb75bB'
let rnsInstance = new web3.eth.Contract(RNS, rnsAddress)

function getOwner(_rnsInstance, _domainName) {
    return _rnsInstance.methods.owner(namehash.hash(_domainName + '.rsk')).call({})
}

function makeCommitment(_fifsInstance, _domainHash, _address, _secret) {
    return _fifsInstance.methods.makeCommitment(_domainHash, _address, _secret).call({from: _address})
}


function sendCommitment(_fifsInstance, _commitment, _address) {
    return _fifsInstance.methods.commit(_commitment).send({from: _address})
}


function finishRegistration(_fifsInstance, _domainName, _secret, _myAddress, _yearsToRegister) {
    return _fifsInstance.methods.register(_domainName, _myAddress, web3.utils.sha3(_secret), _yearsToRegister).send({from: _myAddress})
}

function canReveal(_fifsInstance, _commitment, _address) {
    return _fifsInstance.methods.canReveal(_commitment).send({from: _address})
}

function delay(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time*1000);
    });
  }


const domainNameToReg = 'leyizhou';
let commitmentData = '';

getOwner(rnsInstance, domainNameToReg).then(result=>{
    // check if domainName has been registered!
    if(result !== defaultAddress){
        throw new Error('This domain has already been registered!')
    }
    console.log(result);
    const hexStrLabel = web3.utils.toHex(domainNameToReg)
    const hexStrSecret = web3.utils.sha3('azjieqw1')

    // make commitment
    return makeCommitment(fifsInstance, hexStrLabel, myAddress, hexStrSecret)
}).then((commitment) => {

   commitmentData = commitment;
   console.log(commitment);
   // send commitment
   return sendCommitment(fifsInstance, commitment, myAddress);
}).then(async result => {
    console.log(result);
    // wait at less 60s according to confirm this address
    await delay(10);
    // check if commitment can be revealed
    const revealData = await canReveal(fifsInstance, commitmentData, myAddress)
    console.log(revealData);
    // register domain
    return finishRegistration(fifsInstance, domainNameToReg, 'azjieqw1', myAddress, 0x1)
}).catch(err=>{
    console.log(err);
})
