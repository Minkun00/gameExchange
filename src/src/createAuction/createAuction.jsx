import React, { useState, useEffect } from 'react';
import Caver from 'caver-js';

export default function CreateAuction({ tokenContractAddress, tokenContractABI, nftContractABI, auctionContractABI, nftContractAddress, auctionContractAddress }) {
  const [tokens, setTokens] = useState([]);
  const caver = new Caver(window.klaytn);

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
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gridGap: '10px', 
                marginBottom: '10px' 
            }}>
                {tokens.map((tokenDetail) => (
                    <div key={tokenDetail.tokenId} style={{
                        cursor: 'pointer',
                        border: '1px solid #ddd', 
                        padding: '10px', 
                        borderRadius: '5px', 
              
                    }}>
                    <img src={tokenDetail.imageUrl} alt="NFT" style={{
                        maxWidth: '100%',
                        display: 'block',
                        marginBottom: '5px',
                    }} />
                    <p>Token ID: {tokenDetail.tokenId}</p>
                </div>
            ))}
        </div>
    </div>

    </div>
  );
}


