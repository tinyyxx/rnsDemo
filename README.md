# RNS Test

## Get Started
1. `npm install`
1. `npm run resolution`
1. `npm run subdomains`
1. `npm run reverse`


## Resolution
### 1. Resolve a domain address
查询domain的地址 
```
// 参数是注册的domain
rns.addr('tinyyxx.rsk').then(console.log);
```

__Result__
```
// 解析出来的区块链地址
0x0C50Ecd06Dff8C22A9afc80356D5D7F39921e882
```

### 2. Change resolver
更改resolver地址
```
// 第一个参数domain地址，第二个参数resolver地址
rns.setResolver('tinyyxx12.rsk', '0x1e7AE43e3503eFB886104ace36051Ea72b301CDf').then(console.log);
```

__Result__
```
(node:14700) UnhandledPromiseRejectionWarning: Error: There are no accounts to sign the transaction
    at D:\forgeLabs\RNS\node_modules\@rsksmart\rns\lib\resolutions.js:264:15
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (D:\forgeLabs\RNS\node_modules\@rsksmart\rns\lib\resolutions.js:26:103)
    at _next (D:\forgeLabs\RNS\node_modules\@rsksmart\rns\lib\resolutions.js:28:194)
(node:14700) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was no
t handled with .catch(). (rejection id: 1)
(node:14700) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

### 3. Set address resolution
设置一个domain解析出的地址
```$xslt
/**
* @param domain - Domain to set resolution
* @param addr - Address to be set as the resolution of the given domain
*/
rns.setAddr('tinyyxx12.rsk', '0x0000000000000000000000000000000000000001').then(console.log);
```
__Result__
```
(node:22240) UnhandledPromiseRejectionWarning: Error: There are no accounts to sign the transaction
    at D:\forgeLabs\RNS\node_modules\@rsksmart\rns\lib\resolutions.js:195:15
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (D:\forgeLabs\RNS\node_modules\@rsksmart\rns\lib\resolutions.js:26:103)
    at _next (D:\forgeLabs\RNS\node_modules\@rsksmart\rns\lib\resolutions.js:28:194)
(node:22240) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was no
t handled with .catch(). (rejection id: 1)
(node:22240) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

### 4. Set Bitcoin address resolution
设置domain对应的比特币解析地址
```
/**
* @param domain - Domain to set resolution
* @param addr - Address to be set as the resolution of the given domain
* @param chainId - Should match one of the listed in SLIP44 (https://github.com/satoshilabs/slips/blob/master/slip-0044.md)
*/
rns.setAddr('tinyyxx12.rsk', '0x0000000000000000000000000000000000000001', '0x80000000').then(console.log);
```
__Result__
```
(node:22240) UnhandledPromiseRejectionWarning: Error: There are no accounts to sign the transaction
    at D:\forgeLabs\RNS\node_modules\@rsksmart\rns\lib\resolutions.js:195:15
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (D:\forgeLabs\RNS\node_modules\@rsksmart\rns\lib\resolutions.js:26:103)
    at _next (D:\forgeLabs\RNS\node_modules\@rsksmart\rns\lib\resolutions.js:28:194)
(node:22240) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was no
t handled with .catch(). (rejection id: 1)
(node:22240) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```


## Ownership admin:
### 1. renew a domain
在rns包里没有这个功能实现

### 2. transfer a domain
在rns包里没有这个代码的实现，网页的operation中显示under development
![](transferDomain.jpg)

## Subdomains
### 1. Register a subdomain
注册二级域名
```
/**
* @param domain - Parent .rsk domain. ie: wallet.rsk
* @param label - Subdomain to register. ie: alice
* @param owner - The owner of the new subdomain. If not provided, the address who executes the tx will be the owner
* @param addr - The address to be set as resolution of the new subdomain
*/
rns.subdomains.create('tinyyxx12.rsk', 'rwallet', '0x55d6AbCaECf88d438AEcF32E38B8aB2466fAb737', '0x55d6AbCaECf88d438AEcF32E38B8aB2466fAb737').then(console.log);
```
__Result__
```
(node:35404) UnhandledPromiseRejectionWarning: Error: There are no accounts to sign the transaction
    at D:\forgeLabs\RNS\node_modules\@rsksmart\rns\lib\subdomains.js:174:15
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (D:\forgeLabs\RNS\node_modules\@rsksmart\rns\lib\subdomains.js:22:103)
    at _next (D:\forgeLabs\RNS\node_modules\@rsksmart\rns\lib\subdomains.js:24:194)
(node:35404) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was no
t handled with .catch(). (rejection id: 1)
(node:35404) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

### 2. Change subdomain’s owner
改变子域名的owner
```
/**
* @param domain - Parent .rsk domain. ie: wallet.rsk
* @param label - Subdomain to register. ie: alice
* @param owner - The owner of the new subdomain
*/
rns.subdomains.setOwner('tinyyxx12.rsk', 'rwallet', '0x55d6AbCaECf88d438AEcF32E38B8aB2466fAb737');
```
__Result__
```
(node:35404) UnhandledPromiseRejectionWarning: Error: There are no accounts to sign the transaction
    at D:\forgeLabs\RNS\node_modules\@rsksmart\rns\lib\subdomains.js:128:15
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (D:\forgeLabs\RNS\node_modules\@rsksmart\rns\lib\subdomains.js:22:103)
    at _next (D:\forgeLabs\RNS\node_modules\@rsksmart\rns\lib\subdomains.js:24:194)
(node:35404) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was no
t handled with .catch(). (rejection id: 1)
(node:35404) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```


## Reverse lookup
### 1. Expose the name of your address
暴露你想要的地址对应的domain name
```
/**
* @param name - Name to be set as the reverse resolution of the current address
*/
rns.setReverse('rwallet1.rsk').then(console.log);
```
__Result__
```
(node:10728) UnhandledPromiseRejectionWarning: Error: There are no accounts to sign the transaction
    at D:\forgeLabs\RNS\node_modules\@rsksmart\rns\lib\resolutions.js:304:15
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (D:\forgeLabs\RNS\node_modules\@rsksmart\rns\lib\resolutions.js:26:103)
    at _next (D:\forgeLabs\RNS\node_modules\@rsksmart\rns\lib\resolutions.js:28:194)
(node:10728) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was no
t handled with .catch(). (rejection id: 1)
(node:10728) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```
### 2. Find the name of an address
传入区块链地址，获取该地址的domain name
```
/**
* @param address - address to be resolved
*/
rns.reverse('0x55d6AbCaECf88d438AEcF32E38B8aB2466fAb737').then(console.log);
```
__Result__
```
(node:24092) UnhandledPromiseRejectionWarning: Error: No reverse resolution set
    at D:\forgeLabs\RNS\node_modules\@rsksmart\rns\lib\resolutions.js:64:15
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (D:\forgeLabs\RNS\node_modules\@rsksmart\rns\lib\resolutions.js:26:103)
    at _next (D:\forgeLabs\RNS\node_modules\@rsksmart\rns\lib\resolutions.js:28:194)
    at process._tickCallback (internal/process/next_tick.js:68:7)
(node:24092) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was no
t handled with .catch(). (rejection id: 1)
(node:24092) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

## Register with auction model?:
### 1. Migrate a domain from auction registration
这个rns包里面没有实现，不过这个应该是在网页端做的事情。
