# 🎓 AcademiChain - Cartório Digital Descentralizado

![AcademiChain Status](https://img.shields.io/badge/Status-MVP_Concluído-success)
![Rede](https://img.shields.io/badge/Network-Sepolia_Testnet-blue)
![Licença](https://img.shields.io/badge/License-MIT-green)

## 🚀 O Problema
A falsificação de diplomas, laudos médicos e certificados gera prejuízos incalculáveis à sociedade e às instituições. Os sistemas tradicionais de verificação são lentos, baseados em servidores centralizados (Single Point of Failure) e frequentemente violam a privacidade do usuário ao exigir o upload e armazenamento de dados altamente sensíveis em nuvem.

## 💡 A Solução 
O **AcademiChain** é um sistema Web3 de verificação imutável construído na rede Ethereum (Sepolia). Ele permite que instituições autorizadas registrem a prova de autenticidade de um documento usando criptografia avançada, enquanto qualquer pessoa pode auditar o arquivo instantaneamente, sem burocracia.

### 🛡️ Privacidade by Design (LGPD / GDPR Compliance)
O diferencial absoluto da nossa arquitetura é a **privacidade**. O arquivo do usuário **NUNCA** faz upload para a nuvem. Nosso sistema processa o arquivo localmente no navegador (via FileReader), gera um Hash Criptográfico irreversível (Keccak256) e apenas essa "impressão digital" alfanumérica é enviada e ancorada no Smart Contract. 

## ⚙️ Arquitetura e Tech Stack
O MVP foi construído focando em performance, baixo custo de Gas e UI/UX de nível institucional:

- **Smart Contract:** Solidity `^0.8.20` (Lógica otimizada para eficiência de Gas e proteção contra re-registro).
- **Frontend:** Next.js (App Router) com React.
- **Estilização:** Tailwind CSS (Dark Mode UI com design responsivo).
- **Integração Web3:** Ethers.js v6.
- **Rede Blockchain:** Ethereum Sepolia Testnet.

## 💻 Funcionalidades Principais
1. **Aba Emitir (Apenas Instituições Autorizadas):** Gera o hash local e ancora na blockchain pagando as taxas de rede. Bloqueia tentativas de registro duplicado.
2. **Aba Validar (Acesso Público):** Lê diretamente do ledger da Sepolia. Se o hash bater, comprova a autenticidade exibindo a **Carteira do Emissor** e o **Timestamp** (Data e Hora) exato do registro.

## 🛠️ Como rodar o projeto localmente

1. Clone este repositório e acesse a pasta raiz.
2. Instale as dependências:
   ```bash
   npm install"# AcademiChain" 
"# AcademiChain" 
