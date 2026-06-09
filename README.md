# AcademiChain - Desafio ProofChain

## Sobre o desafio
Projeto desenvolvido para o desafio ProofChain do Hackathon Web3 RESTIC 29. O **AcademiChain** atua como um Cartório Digital Descentralizado para garantir a imutabilidade e autenticidade de documentos.

## Objetivo
Construir uma solução auditável utilizando blockchain. 
Nosso objetivo foi resolver a crise de fraudes documentais (diplomas, laudos) criando um sistema "Trustless". O sistema gera o hash (Keccak256) do documento localmente e o ancora na blockchain. Isso permite a auditoria pública em tempo real, enquanto mantém o arquivo original off-chain, garantindo **100% de compliance com a LGPD**.

## Requisitos mínimos
- [x] Registro on-chain
- [x] Consulta pública
- [x] Contrato deployado em testnet (**Sepolia:** `0x0ad7ca2dbdcc388F20BEbb974205B8568460930D`)
- [x] README funcional
- [x] Vídeo-pitch e Apresentação

## Tecnologias utilizadas
- **Solidity** (Smart Contract otimizado)
- **Sepolia** (Testnet Ethereum)
- **Ethers.js v6** (Integração Web3)
- **Next.js / React** (Frontend e processamento de Hash local)
- **Tailwind CSS** (UI/UX)

## Estrutura
`/contracts` `/frontend` `/scripts` `/test` `/docs`

## Como iniciar

### 1. Instalar dependências
Acesse a pasta do frontend e instale os pacotes necessários:
```bash
cd frontend
npm install