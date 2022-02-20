#! /usr/bin/env node
const libCrypto = require('@waves/ts-lib-crypto')
const fs = require('fs');
const numberOfAccounts = process.argv[2];
const tokenName = process.argv[3];
if (!numberOfAccounts) {
    return console.log('Please enter number of accounts to generate as the first argument and the token name as the second argument')
}

const generateAddresses = (numberOfAccounts, tokenName) => {
    try {
        let accounts = []
        for (let i = 1; i <= numberOfAccounts; i++) {
            const seed = libCrypto.randomSeed() // or input your existing seed
            const sk = libCrypto.privateKey(seed)
            const pk = libCrypto.publicKey(seed)
            const addressBase58 = libCrypto.address(seed) // address for Mainnet
            const addressTestnetBase58 = libCrypto.address(seed, 'T') // address for Testnet

            const account = {
                passPhrase: seed,
                address: addressBase58,
                privateKey: sk,
                publicKey: pk,
                blockchain:"WAVES",
                coin:tokenName,
                testnetAddress: addressTestnetBase58
            }
            accounts.push(account)
        }

        let data = JSON.stringify(accounts);
        fs.writeFileSync('accounts.json', data);
        console.log(`${numberOfAccounts} Accounts generated successfully`);

    } catch (error) {
        return error
    }
}

generateAddresses(numberOfAccounts)

