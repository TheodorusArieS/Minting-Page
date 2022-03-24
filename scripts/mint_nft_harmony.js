require("dotenv").config()
const { HMY_RPC_URL, PRIVATE_KEY, PUBLIC_KEY, PINATA_META_CID } = process.env
const Web3 = require('web3');
let web3 = new Web3(HMY_RPC_URL);

const contract = require('../artifacts/contracts/MyNFT.sol/MyNFT.json')

// jangan lupa gnti contract address nya
const contractAddress = '0xe16E6D53a3D3427bc8b1AA3973CEB5547738D6fE';

const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest');
    const tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 500000,
        'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
    };

    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)

    signPromise.then((signedTx) => {
        web3.eth.sendSignedTransaction(
            signedTx.rawTransaction,
            function (err, hash) {
                if (!err) {
                    console.log('The hash of your transaction is:', hash);
                } else {
                    console.log("Something went wrong and the error is:", err);
                }
            }
        )
    }).catch(err => {
        console.log("Promise Failed:", err)
    })
}

// mintNFT(`https://gateway.pinata.cloud/ipfs/${PINATA_META_CID}/1.json`)
mintNFT(`https://gateway.pinata.cloud/ipfs/${PINATA_META_CID}/`)

// async function checkBalance() {
//     let hmyMasterAccount = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
//     web3.eth.accounts.wallet.add(hmyMasterAccount);
//     web3.eth.defaultAccount = hmyMasterAccount.address

//     const myAddress = web3.eth.defaultAccount;
//     console.log('My address: ', myAddress);

//     const balance = await web3.eth.getBalance(myAddress);
//     console.log('My balance: ', balance / 1e18);

//     const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest');
//     console.log("nonce:",nonce);

// }

// checkBalance();
