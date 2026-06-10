const { ethers } = require("ethers");

// 1. Cole o ABI do seu contrato AcademiChain aqui (pegue no Remix)
const ABI = [ 
  /* Pode deixar vazio mesmo, já que o getCode não usa o ABI */ 
];

// 2. Endereço do contrato
const CONTRACT_ADDRESS = "0x0ad7ca2dbdcc388F20BEbb974205B8568460930D";

// 3. Provider Sepolia (Usando node público confiável)
const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");

async function main() {
    console.log("Iniciando conexão com a Blockchain Sepolia...");
    
    try {
        console.log("Conectado! Verificando contrato...");
        const code = await provider.getCode(CONTRACT_ADDRESS);
        
        if (code !== '0x') {
            console.log("✅ SUCESSO: Contrato encontrado e vivo na rede Sepolia!");
        } else {
            console.log("❌ ERRO: Contrato não encontrado neste endereço.");
        }
    } catch (error) {
        console.error("Erro na conexão:", error);
    }
}

main();