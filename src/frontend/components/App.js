import { BrowserRouter, Routes, Route } from 'react-router-dom';
import logo from './logo.png';
import './App.css';
import Navigation from './navbar';  
import { useState } from "react"
import { ethers } from 'ethers'
import MarketplaceABI from '../contractsData/Marketplace.json'
import MarketplaceAddress from '../contractsData/Marketplace-address.json'
import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'

function App() {

  const [loadding, setLoadding] = useState(true)
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});
  const [account, setAccount] = useState([]);

  // Metamask login/connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
    // get provider from metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // set signer
    const signer = provider.getSigner();

    loadContracts(signer);
  }
  const loadContracts = async (signer) => {
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceABI.abi, signer);
    setMarketplace(marketplace);
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
    setNFT(nft);
    setLoadding(false);
  }
  return (
    <div>
    <Navigation web3Handler={web3Handler}  account = {account}/>
    <Routes>
      
    </Routes>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mx-auto mt-5">
              <a
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={logo} className="App-logo" alt="logo"/>
              </a>
              <h1 className= "mt-5">Dapp University Starter Kit</h1>
              <p>
                Edit <code>src/frontend/components/App.js</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              >
                LEARN BLOCKCHAIN <u><b>NOW! </b></u>
              </a>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
