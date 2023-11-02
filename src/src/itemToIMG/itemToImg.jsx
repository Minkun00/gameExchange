import React, { useState, useCallback } from 'react';
import useImageGenerator from './useImageGenerator';

export default function ItemToImg() {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { imgUri, tokenUri, generateImage } = useImageGenerator();

    const handleSubmit = async () => {
        generateImage(code, name, description); // 이 함수가 이미 상태를 설정합니다.
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