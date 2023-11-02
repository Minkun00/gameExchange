import React, { useEffect, useState } from 'react';
import Caver from 'caver-js';


function Marketplace({ nftContractABI, nftContractAddress, marcketContractABI, marcketContractAddress }) {
  const [listedNfts, setListedNfts] = useState([]);
  const [account, setAccount] = useState(null);

  const caver = new Caver(window.klaytn); 
  const nftContract = new caver.klay.Contract(nftContractABI, nftContractAddress);
  const marketplaceContract = new caver.klay.Contract(marcketContractABI, marcketContractAddress);

  const loadListedNfts = async () => {
    const totalSupply = await nftContract.methods.totalSupply().call();
    const items = [];
    
    for (let i = 1; i <= totalSupply; i++) {
      let tokenId = await nftContract.methods.tokenByIndex(i - 1).call();
      let isListed = await marketplaceContract.methods.isListed(tokenId).call();
      
      if (isListed) {
        let tokenUri = await nftContract.methods.tokenURI(tokenId).call();
        let listingFee = await marketplaceContract.methods.listingFee().call();
        let metadata = await fetch(tokenUri).then(response => response.json());
        
        items.push({ tokenId, image: metadata.image, price: caver.utils.fromPeb(listingFee, 'KLAY') });
      }
    }
    
    setListedNfts(items);
  };

  useEffect(() => {
    loadListedNfts();
    if (window.klaytn) {
      try {
        window.klaytn.enable().then((accounts) => {
          setAccount(accounts[0]);
        });
      } catch (error) {
        console.error('User denied account access', error);
      }
    } else {
      console.error('Non-Kaikas browser detected. You should consider trying Kaikas!');
    }
  }, []);

  const purchaseNFT = async (tokenId) => {
    if (!account) return; 
    try {
      await marketplaceContract.methods.purchaseNFT(tokenId).send({
        from: account,
        value: caver.utils.toPeb('0.1', 'KLAY'), 
        gas: '500000',
      });
    } catch (error) {
      console.error('Purchase failed', error);
    }
  };

  return (
    <div className="marketplace">
      <h2>Marketplace Listings</h2>
      <div className="nft-list">
        {listedNfts.map(nft => (
          <div key={nft.tokenId} className="nft-card">
            <img src={nft.image.replace('ipfs://', 'https://ipfs.io/ipfs/')} alt={`NFT ${nft.tokenId}`} />
            <div className="nft-info">
              <p>Token ID: {nft.tokenId}</p>
              <p>Price: {nft.price} KLAY</p>
              <button onClick={() => purchaseNFT(nft.tokenId)}>Buy NFT</button>
              {/* Item 구매 완료 시, 만약 나중에 게임을 연결했다면 게임으로 바로 아이템 연동되게...*/}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marketplace;
