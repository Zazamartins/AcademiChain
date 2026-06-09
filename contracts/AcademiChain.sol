// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AcademiChain {
    address public owner;

    struct Document {
        address issuer;
        uint256 timestamp;
        bool exists;
    }

    // Controle de quem pode emitir laudos/diplomas
    mapping(address => bool) public authorizedIssuers;
    
    // Registro de hashes
    mapping(bytes32 => Document) public documents;

    event IssuerAdded(address indexed issuer);
    event DocumentRegistered(bytes32 indexed documentHash, address indexed issuer);

    modifier onlyOwner() {
        require(msg.sender == owner, "Acesso negado: apenas owner");
        _;
    }

    modifier onlyIssuer() {
        require(authorizedIssuers[msg.sender], "Acesso negado: apenas emissores autorizados");
        _;
    }

    constructor() {
        owner = msg.sender;
        // Para o MVP, o deployer ja e um emissor autorizado para facilitar testes
        authorizedIssuers[msg.sender] = true; 
    }

    // Função para adicionar novas instituições/hospitais
    function authorizeIssuer(address _issuer) external onlyOwner {
        authorizedIssuers[_issuer] = true;
        emit IssuerAdded(_issuer);
    }

    // Registro do hash do documento na blockchain
    function registerDocument(bytes32 _documentHash) external onlyIssuer {
        require(!documents[_documentHash].exists, "Documento ja registrado");

        documents[_documentHash] = Document({
            issuer: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        emit DocumentRegistered(_documentHash, msg.sender);
    }

    // Verificação pública do documento
    function verifyDocument(bytes32 _documentHash) external view returns (bool exists, address issuer, uint256 timestamp) {
        Document memory doc = documents[_documentHash];
        return (doc.exists, doc.issuer, doc.timestamp);
    }
}