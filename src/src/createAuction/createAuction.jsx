import React, { useState, useEffect } from 'react';
import Caver from 'caver-js';

export default function CreateAuction({ tokenContractAddress, tokenContractABI, nftContractABI, auctionContractABI, nftContractAddress, auctionContractAddress }) {
  const [tokens, setTokens] = useState([]);
  const [startPrice, setStartPrice] = useState('');
  const [tokenId, setTokenId] = useState(null); 
  const [duration, setDuration] = useState('');
  const [selectedTokenId, setSelectedTokenId] = useState(null);

  
  const caver = new Caver(window.klaytn);
  const erc20Contract = new caver.contract(tokenContractABI, tokenContractAddress);

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

  const handleCreateAuction = async () => {
    try {
      const nftContract = new caver.contract(nftContractABI, nftContractAddress);
      const auctionContract = new caver.contract(auctionContractABI, auctionContractAddress);

      const allowance = await erc20Contract.methods.allowance(window.klaytn.selectedAddress, auctionContractAddress).call();
      if (allowance < caver.utils.toPeb(startPrice, 'KLAY')) {
        await erc20Contract.methods.approve(auctionContractAddress, caver.utils.toPeb(startPrice, 'KLAY')).send({ from: window.klaytn.selectedAddress });
      }

      const isApproved = await nftContract.methods.isApprovedForAll(window.klaytn.selectedAddress, auctionContractAddress).call();
      if (!isApproved) {
        await nftContract.methods.setApprovalForAll(auctionContractAddress, true).send({ from: window.klaytn.selectedAddress });
      }

      const fixedGasAmount = '20000000000'; // "gas" is missing error. remix에서도 오류발생..

      await auctionContract.methods.createAuction(selectedTokenId, caver.utils.toPeb(startPrice, 'KLAY'), duration).send({
        from: window.klaytn.selectedAddress,
        gas: fixedGasAmount
      });
      
      console.log('Auction created successfully!');
      alert('Auction created successfully!');
    } catch (error) {
      console.error('Failed to create auction:', error);
      alert('Failed to create auction. See the console for more details.');
    }
  };
  
  

  const handleTokenSelect = async (tokenId) => {
    setTokenId(tokenId); 
    setSelectedTokenId(tokenId); 
  };

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
                    <div key={tokenDetail.tokenId} onClick={() => handleTokenSelect(tokenDetail.tokenId)} style={{
                        cursor: 'pointer',
                        border: '1px solid #ddd', 
                        padding: '10px', 
                        borderRadius: '5px', 
                        backgroundColor: selectedTokenId === tokenDetail.tokenId ? 'yellow' : '', 
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


      {tokenId && (
        <>
          <input
            type="text"
            placeholder="Start Price in KLAY"
            value={startPrice}
            onChange={(e) => setStartPrice(e.target.value)}
          />
          <input
            type="text"
            placeholder="Duration in seconds"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <button onClick={() => handleCreateAuction(tokenId)}>Create Auction</button>
        </>
      )}
    </div>
  );
}


