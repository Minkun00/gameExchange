import React, { useState, useEffect } from 'react';
import { Buffer } from 'buffer';

import Caver from 'caver-js';

export default function CreateAuction({  nftContractABI, marcketContractABI, nftContractAddress, marcketContractAddress }) {
  const [tokens, setTokens] = useState([]);
  const caver = new Caver(window.klaytn);
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [price, setPrice] = useState('');

  const selectNFT = (tokenId) => {
    setSelectedTokenId(tokenId);
  };
  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };
  const listNFT = async () => {
    if(selectedTokenId && price) {
      // 마켓플레이스 컨트랙트 인스턴스 생성
      const marketplaceContract = new caver.contract(marcketContractABI, marcketContractAddress);
      try {
        const listingPrice = caver.utils.toWei(price.toString(), 'ether');
        await marketplaceContract.methods.listNFT(selectedTokenId).send({
          from: window.klaytn.selectedAddress,
          value: listingPrice,
          gas: '2000000',
        });
        console.log(`Token ID: ${selectedTokenId} is now listed with price ${price}`);
      } catch (error) {
        console.error("Listing NFT failed", error);
      }
    } else {
      console.log("No token selected or price set");
    }
  };


  const loadNFTs = async () => {
    const nftContract = new caver.contract(nftContractABI, nftContractAddress);
    const balanceOf = await nftContract.methods.balanceOf(window.klaytn.selectedAddress).call();
    console.log(`nft balance : ${balanceOf}`)
    const tokenDetails = [];
    
    for (let i = 0; i < balanceOf; i++) {
      const tokenId = await nftContract.methods.tokenOfOwnerByIndex(window.klaytn.selectedAddress, i).call();
      const tokenURI = await nftContract.methods.tokenURI(tokenId).call();
      const metadata = await fetchMetadata(tokenURI);
      const imageUrl = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      tokenDetails.push({
        tokenId,
        imageUrl,
      });
      console.log(`Token ID: ${tokenId}, Image URL: ${imageUrl}`); 
    }
  
    setTokens(tokenDetails);
  };
  function convertIPFStoHTTP(ipfsUrl) {
    return ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/')
  }
  
  async function fetchMetadata(uri) {
    const url = convertIPFStoHTTP(uri);
    const response = await fetch(url);
    console.log(response)
    const metadata = await response.json();
    return metadata;
  }

  useEffect(() => {
    if (window.klaytn.selectedAddress) {
        loadNFTs();
    }
  }, [window.klaytn.selectedAddress]);


  return (
    <div>
      <h2>Create Auction</h2>
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridGap: '10px', marginBottom: '10px' }}>
          {tokens.map((tokenDetail) => (
            <div key={tokenDetail.tokenId}
                 style={{
                   cursor: 'pointer',
                   border: '1px solid #ddd',
                   padding: '10px',
                   borderRadius: '5px',
                   backgroundColor: selectedTokenId === tokenDetail.tokenId ? 'lightgrey' : 'white',
                 }}
                 onClick={() => selectNFT(tokenDetail.tokenId)}
            >
              <img src={tokenDetail.imageUrl} alt="NFT" style={{ maxWidth: '100%', display: 'block', marginBottom: '5px', }} />
              <p>Token ID: {tokenDetail.tokenId}</p>
            </div>
          ))}
        </div>
        <input type="text" placeholder="Price in KLAY" value={price} onChange={handlePriceChange} />
        <button onClick={listNFT}>List NFT for Sale</button>
      </div>
    </div>
  );
}


