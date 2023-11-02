import React, { useState, useEffect } from 'react';
import Caver from 'caver-js';
import BuyTokenButton from './BuyTokens/BuyTokens';
import MyTokenAbi from '../../Hardhat_abis/MyToken.json';

const KaikasConnect = () => {
  const [account, setAccount] = useState('');
  const [caver, setCaver] = useState(null);

  useEffect(() => {
    if (window.klaytn) {
      const caverInstance = new Caver(window.klaytn);
      setCaver(caverInstance);
      loadBlockchainData(caverInstance);
    } else {
      alert('Please install Kaikas!');
    }
  }, []);

  const loadBlockchainData = async (caverInstance) => {
    const accounts = await caverInstance.klay.getAccounts();
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      alert('Please connect to Kaikas!');
    }
  };

  const connectWalletHandler = async () => {
    if (window.klaytn) {
      const accounts = await window.klaytn.enable();
      setAccount(accounts[0]);
    } else {
      alert('Please install Kaikas!');
    }
  };

  return (
    <div>
      {account ? (
        <p>Connected account: {account}</p>
      ) : (
        <button onClick={connectWalletHandler}>Connect to Kaikas</button>
      )}
      {caver && (
        <div>
          <BuyTokenButton caver={caver} tokenContractAddress="0xc601bf82879e0f6621458f68ed82a9df8c75d788" tokenAbi={MyTokenAbi.abi}/>
        </div>
      )}
    </div>
  );
};

export default KaikasConnect;
