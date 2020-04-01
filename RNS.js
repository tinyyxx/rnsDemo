const Web3 = require('web3');
const RNS = require('@rsksmart/rns');

// const web3 = new Web3('https://public-node.testnet.rsk.co');
// const rns = new RNS(web3);


// 这块是照着以前写的，具体目的是为了创建一个钱包环境，模拟网页端的metaMask
const rskEndpoint = 'https://public-node.testnet.rsk.co';
const HDWalletProvider = require('@truffle/hdwallet-provider');

const mnemonic = 'fabric arrest space cost embark tell pear balance title girl photo valley'; // 12 word mnemonic
const provider = new HDWalletProvider(mnemonic, rskEndpoint);
const web3 = new Web3(provider);
const rns = new RNS(web3);

// 解析该域名对应的RBTC address
// rns.addr('tinyyxx12.rsk').then(console.log);

// 判断子域名是否可用，报错
// rns.isSubdomainAvailable('tinyyxx12.rsk', 'rwallet').then(console.log);

// 注册域名，也会报错
rns.setAddr('tinyyxx12', '0x2cF0028790eeD9374Fce149f0De3449128738CF4').then(console.log);
// rns.setAddr('testing.rsk', '0x0000000000000000000000000000000123456789').then(() => console.log('Done!'));
