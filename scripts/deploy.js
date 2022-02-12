const { ethers } = require("hardhat");

async function main() {
    const MyNFT = await ethers.getContractFactory("NFT")

    // Start deployment, returning a promise that resolves to a contract object
    // Input constructor argument if any
    
    // const myNFT = await MyNFT.deploy()
    const myNFT = await MyNFT.deploy('Tiny','TL','https://gateway.pinata.cloud/ipfs/QmU6UNCSPTQkhF3Ww7fHQwhHfb2Kn6mT7cL5E29VCjf4iD/','https://gateway.pinata.cloud/ipfs/QmU6UNCSPTQkhF3Ww7fHQwhHfb2Kn6mT7cL5E29VCjf4iD/1.json');
    
    await myNFT.deployed()
    console.log("Contract deployed to address:", myNFT.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
