# 🎓 AcademiChain: A Verdade Ancorada na Rede

![Status](https://img.shields.io/badge/Status-MVP_Funcional-success)
![Network](https://img.shields.io/badge/Rede-Sepolia_Testnet-blue)
![SmartContract](https://img.shields.io/badge/Smart_Contract-Solidity_0.8.20-black)
![Frontend](https://img.shields.io/badge/Frontend-Next.js_%7C_Ethers.v6-purple)

> *"Em um mundo digital onde dados podem ser adulterados com um clique, a confiança não pode depender de servidores centrais. A confiança precisa ser matemática, imutável e descentralizada."*

## 🚨 1. O Problema Real
Vivemos uma crise de autenticidade. A falsificação de diplomas, certificados e laudos médicos gera prejuízos incalculáveis e destrói a reputação de instituições. Hoje, validar um documento exige processos manuais, lentos e dependentes de servidores centralizados (SPOF - *Single Point of Failure*) que estão suscetíveis a quedas, invasões e adulterações internas.

## 💡 2. Por que Blockchain?
A tecnologia Blockchain é a única arquitetura capaz de criar um ambiente **"Trustless"**. Escolhemos a rede Ethereum (Testnet Sepolia) porque ela nos permite:
1. **Descentralizar a confiança:** Nenhum administrador (nem mesmo nós) pode apagar ou alterar um registro válido.
2. **Garantir a Imutabilidade:** Uma vez que a transação é minerada, a prova criptográfica do documento se torna eterna.
3. **Auditoria Pública e Gratuita:** Qualquer pessoa, em qualquer lugar do mundo, pode verificar os dados sem depender de APIs proprietárias.

## ⚙️ 3. O Fluxo Principal: Como Funciona?
Desenvolvemos uma integração fluida entre o Frontend (Next.js) e a Blockchain (Ethers.js), dividida em dois pilares:

### A. Registro (Aba Emitir)
1. A instituição faz o upload do documento.
2. O sistema gera **localmente** no navegador um hash criptográfico (Keccak256) do arquivo.
3. A carteira do emissor assina a transação via MetaMask, ancorando apenas o Hash na Sepolia. O Smart Contract impede o registro de hashes duplicados.

### B. Verificação (Aba Validar)
1. O usuário final (ex: um recrutador do RH) acessa a plataforma e insere o arquivo que recebeu.
2. O sistema gera o hash daquele arquivo na hora e consulta o Smart Contract.
3. Se os hashes baterem, o sistema retorna **"Documento Autêntico"**, provando a integridade do arquivo de forma instantânea.

## 🔒 4. Privacidade e LGPD by Design (On-Chain vs Off-Chain)
A grande inovação arquitetural do AcademiChain é o uso estratégico do *Hashing* para garantir privacidade absoluta. **O arquivo do usuário NUNCA faz upload para a rede.**

| ⛓️ Dados On-Chain (Blockchain) | 📂 Dados Off-Chain (Local / Nuvem Privada) |
| :--- | :--- |
| **Hash Keccak256** (A impressão digital única) | **Arquivo Original** (PDF, Imagem, XML) |
| **Wallet do Emissor** (Quem validou) | **Dados Pessoais Sensíveis** (Nome, CPF, Notas) |
| **Timestamp** (Data e hora exata do registro) | **Conteúdo do Laudo/Diploma** |

*O uso do Keccak256 garante a **Integridade** (mudar um ponto final no PDF gera um hash completamente diferente). O registro na blockchain garante a **Autenticidade** e a **Rastreabilidade** do emissor.*

## 🚀 5. Aplicação Prática no Mercado
* **Educação:** Universidades registrando diplomas para erradicar currículos falsos em processos seletivos.
* **Saúde:** Clínicas ancorando laudos e atestados médicos para evitar fraudes em planos de saúde.
* **Corporativo:** Assinaturas de contratos digitais e NDA's (Non-Disclosure Agreements).

## 🛠️ 6. Como Rodar o MVP Localmente

**Pré-requisitos:** Node.js instalado e extensão MetaMask no navegador (conectada à rede Sepolia com fundos de teste).

```bash
# 1. Clone o repositório e acesse a pasta do frontend
cd frontend

# 2. Instale as dependências
npm install

# 3. Rode o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:3000` para interagir com o DApp.

* **Endereço do Contrato (Sepolia):** `0x0ad7ca2dbdcc388F20BEbb974205B8568460930D`
* **Compilação do Contrato (Opcional):** A lógica on-chain pode ser inspecionada compilando os arquivos na raiz via Hardhat (`npx hardhat compile`).

## 👥 7. Equipe (MVP High-Tech)
* Isaac Martins de Oliveira Braga e Sousa
* Lara Rodrigues Barros
* Felipe Marinho de Carvalho

---
*Este projeto foi desenvolvido para o Desafio ProofChain do Hackathon Web3 RESTIC 29. A estrutura cumpre 100% dos requisitos técnicos e apresenta uma UI/UX profissional, com fluxos claros e tratamento completo de exceções Web3.*