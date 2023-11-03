// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
// 이 과정은 remix에서 진행하고 deploy했기에, 따로 여기에는 truffle, hardhat은 없다.
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") {
        _mint(msg.sender, initialSupply);
    }

    function purchase() external payable {
        uint256 amountToMint = msg.value; // 1:1 비율
        _mint(msg.sender, amountToMint);
    }
}

contract MyNFT is ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    // ERC721Enumerable를 사용할 때는 부모 컨트랙트의 함수를 오버라이드해야 합니다.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // 토큰 ID에 대한 정보를 얻기 위한 지원 함수입니다.
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    // 토큰 URI를 가져오기 위한 함수입니다.
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // 모든 부모 컨트랙트에 구현된 supportsInterface 함수를 호출합니다.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // NFT를 민팅하고, 토큰 URI를 설정하는 함수입니다. msg.sender가 주인이 됩니다
    function mint(string memory uri) public {
        _tokenIdCounter.increment();
        uint256 newItemId = _tokenIdCounter.current();
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, uri); // 토큰 ID와 메타데이터 URI를 연결합니다.
    }

    function burn(uint256 tokenId) public onlyOwner returns (bool) {
        require(_exists(tokenId), "Token does not exist");
        _burn(tokenId);
        return true;
    }
}

contract MyMarketplace is Ownable {
    MyNFT public nft;
    MyToken public token;
    uint256 public listingFee = 0.1 ether;

    mapping(uint256 => bool) public isListed;

    event NFTListed(uint256 tokenId, address seller);
    event NFTUnlisted(uint256 tokenId);

    constructor(address _nft, address _token) {
        nft = MyNFT(_nft);
        token = MyToken(_token);
    }

    function listNFT(uint256 tokenId) external {
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(!isListed[tokenId], "Already listed");
        
        nft.transferFrom(msg.sender, address(this), tokenId);
        isListed[tokenId] = true;
        
        emit NFTListed(tokenId, msg.sender);
    }

    function unlistNFT(uint256 tokenId) external {
        require(isListed[tokenId], "Not listed");
        require(nft.ownerOf(tokenId) == address(this), "Not held by the marketplace");
        
        nft.transferFrom(address(this), msg.sender, tokenId);
        isListed[tokenId] = false;
        
        emit NFTUnlisted(tokenId);
    }

    function purchaseNFT(uint256 tokenId) external payable {
        require(isListed[tokenId], "Not listed");
        require(msg.value >= listingFee, "Insufficient payment");

        address seller = nft.ownerOf(tokenId);
        nft.transferFrom(seller, msg.sender, tokenId);
        isListed[tokenId] = false;
        
        // 판매 수수료를 판매자에게 지급
        payable(seller).transfer(msg.value - listingFee);
    }

    function setListingFee(uint256 fee) external onlyOwner {
        listingFee = fee;
    }
}