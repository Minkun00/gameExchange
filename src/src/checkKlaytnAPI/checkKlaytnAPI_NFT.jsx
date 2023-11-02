import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // .env 파일을 로드

const API_URL = 'https://th-api.klaytnapi.com'; // Klaytn API 엔드포인트 URL

const address = '0x2b85Fc92EbF1e8f516d4aea7f3051867DeA03e16'; // Parameter로 넣을 주소 값
const xChainId = '1001'; // x-chain-id 값

// .env 파일에서 사용자 이름과 비밀번호 가져오기
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

// Axios를 사용하여 API 요청 보내기
const fetchData = async () => {
  try {
    const response = await axios.get(`${API_URL}/your-endpoint`, {
      headers: {
        'x-chain-id': xChainId,
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
      },
      params: {
        address,
      },
    });

    // 응답 데이터 처리
    console.log('데이터:', response.data);
  } catch (error) {
    console.error('데이터 가져오기 실패:', error);
  }
};

// fetchData 함수 호출
fetchData();
