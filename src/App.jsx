import React from 'react';
import KaikasConnect from './src/kaikasConnect/KaikasConnect';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ItemToImg from './src/itemToIMG/itemToImg';
import CreateAuction from './src/createAuction/createAuction';

import myToken from './Hardhat_abis/MyToken.json';
import myNFT from './Hardhat_abis/MyNFT.json';
import myAuction from './Hardhat_abis/MyAuction.json';

function App() {
  const nftContractABI = myNFT.abi;
  const tokenContractABI = myToken.abi;
  const auctionContractABI = myAuction.abi;

  const nftContractAddress = "0x2c31932075395d443eb6a793f503380ec3079990"; 
  const tokenContractAddress = "0xc56d366f7af69280f5d7b5ee70b01142b6fc394e"; 
  const auctionContractAddress = "0x5b673daad129dc3ee19817b88aaa537e11286d33"; 

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
              auctionContractABI={auctionContractABI}
              nftContractAddress={nftContractAddress}
              tokenContractAddress={tokenContractAddress}
              auctionContractAddress={auctionContractAddress}
            />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
