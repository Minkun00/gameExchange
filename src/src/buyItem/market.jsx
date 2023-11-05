import React, { useState, useEffect } from 'react';
import Caver from 'caver-js';

export default function Marcketplace({ nftContractABI, nftContractAddress, marcketContractABI, marcketContractAddress }) {
  const caver = new Caver(window.klaytn);
  const [listedNfts, setListedNfts] = useState([]);
  
  const loadListedNFTs = async () => {
    const marketplaceContract = new caver.klay.Contract(marcketContractABI, marcketContractAddress);
    const result = await marketplaceContract.methods.getListedNFTs().call();
    console.log(result)
    // const nftContract = new caver.klay.Contract(nftContractABI, nftContractAddress);

    // const listedItems = await Promise.all(tokenIds.map(async (tokenId, index) => {
    //   const tokenURI = await nftContract.methods.tokenURI(tokenId).call();
    //   const metadata = await fetchMetadata(tokenURI);
    //   const imageUrl = convertIPFStoHTTP(metadata.image);
    //   return {
    //     tokenId,
    //     imageUrl,
    //     price: caver.utils.fromWei(prices[index], 'ether')
    //   };
    // }));
    // setListedNfts(listedItems);
  };
  function convertIPFStoHTTP(ipfsUrl) {
    return ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }

  async function fetchMetadata(uri) {
    const url = convertIPFStoHTTP(uri);
    const response = await fetch(url);
    const metadata = await response.json();
    return metadata;
  }

  useEffect(() => {
    loadListedNFTs();
  }, []);

  return (
    <div>
      <h2>Listed NFTs</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridGap: '10px' }}>
        {listedNfts.map((nft) => (
          <div key={nft.tokenId} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
            <img src={nft.imageUrl} alt={`NFT ${nft.tokenId}`} style={{ maxWidth: '100%', display: 'block', marginBottom: '5px' }} />
            <p>Token ID: {nft.tokenId}</p>
            <p>Price: {nft.price} KLAY</p>
            {/* 여기에 구매 버튼을 추가할 수 있습니다 */}
          </div>
        ))}
      </div>
    </div>
  );
}
