import React from 'react';
import KaikasConnect from './src/kaikasConnect/KaikasConnect';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ItemToImg from './src/itemToIMG/itemToImg';
import CreateAuction from './src/createAuction/createAuction';

import myToken from './Hardhat_abis/MyToken.json';
import myNFT from './Hardhat_abis/MyNFT.json';

function App() {
  const nftContractABI = myNFT.abi;
  const tokenContractABI = myToken.abi;

  const nftContractAddress = "0x7a18e5223451c77bb023ebccd24fb4e6569f86b1"; 
  const tokenContractAddress = "0x43188d7f49ae11b07b0ee8a0a5c97bfc94cb3494"; 

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
              tokenContractAddress={tokenContractAddress}
            />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
