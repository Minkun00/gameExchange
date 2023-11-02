import React from 'react';
import KaikasConnect from './src/kaikasConnect/KaikasConnect';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ItemToImg from './src/itemToIMG/itemToImg';
import CreateAuction from './src/createAuction/createAuction';
import Marketplace from './src/buyItem/marcket';
import myToken from './Hardhat_abis/MyToken.json';
import myNFT from './Hardhat_abis/MyNFT.json';
import myMarcket from './Hardhat_abis/MyMarketplace.json';
import CheckKlaytnAPI from './src/checkKlaytnAPI/checkKlaytnAPI_NFT';

function App() {
  const nftContractABI = myNFT.abi;
  const tokenContractABI = myToken.abi;
  const marcketContractABI = myMarcket.abi;
  const nftContractAddress = "0x7a18e5223451c77bb023ebccd24fb4e6569f86b1"; 
  const tokenContractAddress = "0x43188d7f49ae11b07b0ee8a0a5c97bfc94cb3494"; 
  const marcketContractAddress = "0xbbfade63d9f71eb6297eee3f05144e2742c149e4";

  return (
    <Router> 
      <div>
        <h1>Welcome to MyToken DApp</h1>
        <KaikasConnect />
        <Routes>
          <Route path="/inputCode" element={<ItemToImg />} /> 
          <Route path="/createAuction" element={
            <CreateAuction
              nftContractABI={nftContractABI}
              tokenContractABI={tokenContractABI}
              nftContractAddress={nftContractAddress}
              marcketContractABI={marcketContractABI}
              marcketContractAddress={marcketContractAddress}
            />
          } />
            <Route path="/market" element={
            <Marketplace
              nftContractABI={nftContractABI}
              nftContractAddress={nftContractAddress}
              marcketContractABI={marcketContractABI}
              marcketContractAddress={marcketContractAddress}
            />}/>
            <Route path="/klaytnNFT" element={<CheckKlaytnAPI/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
