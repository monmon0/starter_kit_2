const { ethers } = require("hardhat");

const { expect } = require("chai");

describe("NFTMarketplace", function(){
    let deployer, addr1, addr2, nft, marketplace
    let feePercent = 1
    let URI = "Sample URI"
    beforeEach( async function() {
        const NFT = await ethers.getContractFactory("NFT");
        const Marketplace = await ethers.getContractFactory("Marketplace");

        // get signers
        [deployer, addr1, addr2] = await ethers.getSigners()

        // deployed contracts
        nft = await NFT.deploy();
        marketplace = await Marketplace.deploy(feePercent);
    });
    describe("Deployment", function(){
        it("should track name and symbol of the nft collection", async function(){
           expect(await nft.name()).to.equal("DApp NFT")
           expect(await nft.symbol()).to.equal("DAPP")
        })
    })
    describe("Minting NFTs", function(){
        it("should track each minted NFT", async function(){
            
            // addr 1 mint nft
            await nft.connect(addr1).mint(URI)
            expect(await nft.tokenCount()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);

            await nft.connect(addr2).mint(URI)
            expect(await nft.tokenCount()).to.equal(2);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.tokenURI(2)).to.equal(URI);
        })
    })
})