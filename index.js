const Web3 = require('web3')
const FIFSRegistrar = require('./abi/FIFSRegistrar.json')
const RNS = require('./abi/RNS.json')
const namehash = require('eth-ens-namehash')

const rskEndpoint = 'https://public-node.testnet.rsk.co'
const defaultAddress = "0x0000000000000000000000000000000000000000"
const myAddress = '0x0c50ecD06DFF8C22A9aFC80356d5d7f39921E882'

let web3 = new Web3(rskEndpoint)

const fifsAddress = '0x36ffda909f941950a552011f2c50569fda14a169'
const fifsInstance = new web3.eth.Contract(FIFSRegistrar, fifsAddress)

let rnsAddress = '0x7d284aaac6e925aad802a53c0c69efe3764597b8'
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


getOwner(rnsInstance, 'leyizhou').then(result=>{
    console.log(result);
    return makeCommitment(fifsInstance, 'leyizhou.rsk', myAddress, 'azjieqw1')
}).then(data=>{
    console.log(data);
})
