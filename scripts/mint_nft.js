require("dotenv").config()
const { API_URL, PRIVATE_KEY, PUBLIC_KEY,PINATA_META_CID } = process.env
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

const contract = require('../artifacts/contracts/MyNFT.sol/MyNFT.json')
const contractAddress = '0xF40c78DFbE083a7476F31B8d9E3e0E3fae88E525';

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
