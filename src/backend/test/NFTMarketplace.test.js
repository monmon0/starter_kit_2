const { ethers } = require("hardhat");

const { expect } = require("chai");

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

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

    describe("Making marketplace Items", function(){
        beforeEach(async function(){
            await nft.connect(addr1).mint(URI)
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true)
        })
        it("should track each marketplace item", async function(){
            await expect(marketplace.connect(addr1).makeItems(nft.address, 1, toWei(1)))
            .to.emit(marketplace, "Offered")
            .withArgs(
                1,
                nft.address,
                1,
                toWei(1),
                addr1.address,
            )
            // owner of NFT should be marketplace
            expect(await nft.ownerOf(1)).to.equal(marketplace.address);
            // marketplace should have 1 item
            expect(await marketplace.itemCount()).to.equal(1);

            // get item from items mapping then check each field to make sure they are correct
            const item = await marketplace.items(1)
            expect(item.itemId).to.equal(1)
            expect(item.nft).to.equal(nft.address)
            expect(item.tokenId).to.equal(1)
            expect(item.price).to.equal(toWei(1))
            expect(item.sold).to.equal(false)

        });
    });

    // describe("Buying marketplace Items", function(){
    //     beforeEach(async function(){
    //         await nft.connect(addr1).mint(URI)
    //         await nft.connect(addr1).setApprovalForAll(marketplace.address, true)
    //         await marketplace.connect(addr1).makeItems(nft.address, 1, toWei(price))
    //     })
    //     it("shoudl track each purchase", async function(){
    //         const sellerInitialEthbal = await addr1.getBalance()
    //         const feeAccountInistialEthbal = await deployer.getBalance()
    //         let totalPriceInWei = await marketplace.getTotalPrice(1);

    //         await expect(marketplace.connect(addr2)).purchaseItem(1, {value: totalPriceInWei})
    //         .to.emit(marketplace, "Bought")
    //         .withArgs(
    //             1,
    //             nft.address,
    //             1,
    //             toWei(price),
    //             addr1.address,
    //             addr2.address,
    //         )
            // const sellerInitialEthbalAfter = await addr1.getBalance()
            // const feeAccountInistialEthbalAfter = await deployer.getBalance()
            // // seller should receive payment
            
            // });    

    // })
})