require("dotenv").config();

const axios = require("axios");
const FormData = require("form-data");
const sharp = require("sharp");
const { Readable } = require('stream');

const { ACCESS_KEY, SECRET_ACCESS_KEY } = process.env;

const usePinata = async (code, _name, _description) => {   // code : item code, _name : name of the item, _description : description of the item
  const codeObj = await disolveCode(code);
  const combinedImageBuffer = await combineImages(codeObj);

  const imageStream = new Readable({
    read() {
      this.push(combinedImageBuffer);
      this.push(null);
    }
  });
  
  const formData = new FormData();
  formData.append("file", imageStream, {
    filename: `${code}.png`
  });

  const imgUrl = await uploadImgToPinata(formData);
  console.log("Pinata에 이미지 저장이 완료되었습니다. : ", imgUrl);

  // 메타데이터
  const metaData = {
    name: _name,
    description: _description,
    image: imgUrl,
    code: `${code}`
  };

  const tokenUri = await jsonToPinata(metaData);
  console.log("Pinata에 메타데이터 저장이 완료되었습니다. : ", tokenUri);

  return { code, imgUrl, tokenUri };
};

const disolveCode = async(code) => {
  const codeString = String(code).padStart(4, '0'); 
  
  const backgroundCode = parseInt(codeString[0], 10);
  const itemNameCode = parseInt(codeString[1], 10);
  const itemCode = parseInt(codeString[2], 10);
  const rankCode = parseInt(codeString[3], 10);

  let codeObj = {
      background: getBackgroundByCode(backgroundCode),
      itemName: getItemNameByCode(itemNameCode),
      item: getItemByCode(itemCode),
      rank: getRankByCode(rankCode)
  };

  return codeObj;
}

const getBackgroundByCode = (code) => {
  switch (code) {
      case 1:
        return 'Blue';
      case 2:
        return 'Green';
      case 3:
        return 'Orange';
      case 4:
        return 'Purple';
      case 5:
        return 'Red';
      case 6:
        return 'Skyblue'; 
      default:
          return 'Yellow';
  }
}

const getItemNameByCode = (code) => {
  switch (code) {
      case 1:
        return 'Absolute';
      case 2:
        return 'Knight';
      default:
        return 'Default';
  }
}

const getItemByCode = (code) => {
  // 예시로 아래와 같이 설정, 실제 값에 맞게 수정 필요
  switch (code) {
    case 1:
      return 'Armor';
    case 2:
      return 'Helmet';
    case 3:
      return 'Pants';
    case 4:
      return 'Shoes';
    default:
      return 'Sword';
}
}

const getRankByCode = (code) => {
  // 예시로 아래와 같이 설정, 실제 값에 맞게 수정 필요
  switch (code) {
      case 1:
        return 'Normal';
      case 2:
        return 'Epic';
      case 3:
        return 'Unique';
      case 4:
        return 'Legendary';
      default:
        return 'Normal';
  }
}


const combineImages = async(code) => {
  const backgroundPath = `./Images/Background/${code.background}.png`;
  const itemPath = `./Images/${code.itemName}/${code.item}.png`;
  const rankEdgePath = `./Images/RankEdge/${code.rank}.png`;

  let combinedImage = sharp(backgroundPath);
  combinedImage = combinedImage.composite([{ input: rankEdgePath }]);
  combinedImage = combinedImage.composite([{ input: itemPath }]);
  

  const outputBuffer = await combinedImage.toBuffer();
  return outputBuffer;
}

const uploadImgToPinata = async (data) => {
  // 이 함수의 매개변수로 들어오는 data는 FormData 객체 입니다.

  try {
    const res = await axios
      .post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
        maxContentLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: `${ACCESS_KEY}`, // ACCESS_KEY는 Pinata의 'API Key'입니다.
          pinata_secret_api_key: `${SECRET_ACCESS_KEY}`, // SECRET_ACCESS_KEY는 Pinata의 'API Secret'입니다.
        },
      })
      .then((res) => {
        return `ipfs://${res.data.IpfsHash}`;
      })
      .catch((err) => {
        console.log(err);
      });

    return res;
  } catch (err) {
    console.error(err);
  }
};

const jsonToPinata = async (metaData) => {
  try {
    const baseUrl = "https://gateway.pinata.cloud/ipfs/"; // Pinata에 Metadata를 저장하고 나면 얻을 수 있는 ipfs hash값을 엔드포인트로 넣어야 합니다.
    const data = JSON.stringify({
      pinataMetadata: {
        name: metaData.name,
      },
      pinataContent: metaData,
    });

    const res = await axios
      .post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: `${ACCESS_KEY}`, // ACCESS_KEY는 Pinata의 'API Key'입니다.
          pinata_secret_api_key: `${SECRET_ACCESS_KEY}`, // SECRET_ACCESS_KEY는 Pinata의 'API Secret'입니다.
        },
      })
      .then((res) => {
        const result = `${baseUrl}${res.data.IpfsHash}`; // result 예시 => "https://gateway.pinata.cloud/ipfs/Qmf1xUQnQHVDWhbXhMjqrWBCugDhmhSQvvfpQfd8ePoxCS"
        return result;
      });

    return res;
  } catch (err) {
    console.error(err);
  }
};

export default usePinata;