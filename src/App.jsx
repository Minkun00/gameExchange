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

  const nftContractAddress = "0xe0cb2632b3bbf87fbac56b599b1b0007edea39d2"; 
  const tokenContractAddress = "0xc601bf82879e0f6621458f68ed82a9df8c75d788"; 

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
