import React, { useState, useEffect } from 'react';
import useImageGenerator from './useImageGenerator';
import Caver from 'caver-js';

const caver = new Caver(window.klaytn);
const nftContractAddress = "0x2c31932075395d443eb6a793f503380ec3079990";

export default function ItemToImg() {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { imgUri, tokenUri, generateImage } = useImageGenerator();

    const nftContractABI = require('../../Hardhat_abis/MyNFT.json').abi;

    const handleSubmit = async () => {
        await generateImage(parseInt(code, 10), name, description);
        console.log(`imgUri : ${imgUri}, tokenUri : ${tokenUri}`)
    };

    useEffect(() => {
        const mintNFT = async () => {
            if (imgUri && tokenUri ) {
                try {
                    const nftContract = new caver.klay.Contract(nftContractABI, nftContractAddress)
                    console.log(`address : ${window.klaytn.selectedAddress}, tokenUri : ${tokenUri}`)
                    const response = await nftContract.methods.mint(window.klaytn.selectedAddress, tokenUri).send({
                        from: window.klaytn.selectedAddress,
                        gas: '2000000'
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