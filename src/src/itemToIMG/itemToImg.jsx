import React, { useState } from 'react';
import usePinata from './Pinata/Pinata'; // usePinata 함수가 있는 파일 경로를 정확하게 입력하세요.

function ItemToImg() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imgUri, setImgUri] = useState('');
  const [tokenUri, setTokenUri] = useState('');

  const handleSubmit = async () => {
    try {
      // usePinata 함수를 사용하여 이미지와 메타데이터를 생성하고 IPFS에 업로드합니다.
      const { imgUrl, tokenUri } = await usePinata(code, name, description);
      setImgUri(imgUrl); // 이미지 URI를 상태로 저장합니다.
      setTokenUri(tokenUri); // 토큰 URI를 상태로 저장합니다.
    } catch (error) {
      // 에러 처리 로직을 여기에 작성합니다.
      console.error("Error during usePinata function call", error);
    }
  };

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
        <p>Image URI: {imgUri}</p>
        <img src={imgUri.replace('ipfs://', 'https://ipfs.io/ipfs/')} alt="Generated" />
      </div>}
      
      {tokenUri && <p>Token URI: {tokenUri}</p>}
    </div>
  );
}

export default ItemToImg;
