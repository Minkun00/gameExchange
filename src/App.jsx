import React from 'react';
import KaikasConnect from './src/kaikasConnect/KaikasConnect';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ItemToImg from './src/itemToIMG/itemToImg';
import CreateAuction from './src/createAuction/createAuction';
import Marketplace from './src/buyItem/market';
import myToken from './Hardhat_abis/MyToken.json';
import myNFT from './Hardhat_abis/MyNFT.json';
import myMarcket from './Hardhat_abis/MyMarketplace.json';
import CheckKlaytnAPI from './src/checkKlaytnAPI/checkKlaytnAPI_NFT';

function App() {
  const nftContractABI = myNFT.abi;
  const tokenContractABI = myToken.abi;
  const marcketContractABI = myMarcket.abi;
  const nftContractAddress = "0x3bd19bf2e77f90ce4d1333cda8890e2a68c30da3"; 
  const tokenContractAddress = "0xee200efca30cc49871d21bfa109ec3dafd6925b3"; 
  const marcketContractAddress = "0xfabedaa6af05b6e3016a0eb62dfc8c0252297e0c";

  return (
    <Router> 
      <div>
        <h1>Welcome to MyToken DApp</h1>
        <KaikasConnect 
          tokenContractABI={tokenContractABI} 
          tokenContractAddress={tokenContractAddress} />
        <Routes>
          <Route path="/inputCode" element={
            <ItemToImg 
              nftContractABI={nftContractABI}
              nftContractAddress={nftContractAddress}
            />} /> 
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
