import React, { useState, useEffect } from 'react';
import useImageGenerator from './useImageGenerator';
import Caver from 'caver-js';

const caver = new Caver(window.klaytn);
const nftContractAddress = "0xe0cb2632b3bbf87fbac56b599b1b0007edea39d2";

export default function ItemToImg() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { imgUri, tokenUri, generateImage } = useImageGenerator();

  const nftContractABI = require('../../Hardhat_abis/MyNFT.json').abi;
  const PRICE_PER_NFT = caver.utils.toPeb('0.01', 'KLAY'); // 이 값은 문자열로 반환됩니다.

  const handleSubmit = async () => {
      await generateImage(parseInt(code, 10), name, description);
      console.log(`imgUri : ${imgUri}, tokenUri : ${tokenUri}`);
  };

  useEffect(() => {
    const mintNFT = async () => {
      if (imgUri && tokenUri) {
        try {
          const nftContract = new caver.klay.Contract(nftContractABI, nftContractAddress)
          const mintPrice = await nftContract.methods.ETH_PER_10_TOKENS().call(); // 이 값은 이미 peb 단위일 것입니다.
          const valueToSend = caver.utils.toBN(mintPrice).div(caver.utils.toBN('10')).toString(); // 10으로 나누어 값을 계산합니다.
  
          const response = await nftContract.methods.mintNFT(tokenUri).send({
            from: window.klaytn.selectedAddress,
            gas: '2000000',
            value: valueToSend // 계산된 값을 전달합니다.
          });
          console.log('NFT Minted!', response);
        } catch (error) {
          console.error('Error minting NFT:', error);
        }
      }
    };
  
    mintNFT();
  }, [imgUri, tokenUri]);

  return (
    <div>
      <h1>Enter Your Code</h1>
      <input
        type="text"
        placeholder="Code"
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <button onClick={handleSubmit}>Generate</button>

      {imgUri && <div>
        <img src={imgUri.replace('ipfs://', 'https://ipfs.io/ipfs/')} alt="Generated" />
      </div>}
    </div>
  );
}