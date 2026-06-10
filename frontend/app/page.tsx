'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ShieldCheck, UploadCloud, FileSearch, CalendarDays, Wallet, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
// Certifique-se de que o caminho para o seu blockchain.js está correto
import { connectWallet, getContractInstance } from '../blockchain';

export default function Home() {
  // === ESTADOS DO COMPONENTE ===
  const [mounted, setMounted] = useState(false); // <--- A MÁGICA CONTRA O HYDRATION ERROR AQUI
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [activeTab, setActiveTab] = useState('emitir'); // 'emitir' ou 'verificar'
  const [currentHash, setCurrentHash] = useState('');
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  // Garante que a interface só processe coisas do navegador (como a carteira) após carregar a página
  useEffect(() => {
    setMounted(true);
  }, []);

  // Função para conectar carteira (usada no botão do header)
  const handleConnect = async () => {
    try {
      setStatus('Conectando...');
      const signer = await connectWallet();
      const address = await signer.getAddress();
      const contractInstance = await getContractInstance(signer);
      setAccount(address);
      setContract(contractInstance);
      setStatus(`Conectado: ${address.substring(0,6)}...${address.substring(38)}`);
    } catch (error) {
      console.error(error);
      setStatus('Erro ao conectar MetaMask.');
    }
  };

  // Gera o Hash Keccak256 localmente (LGPD Compliance)
  const processFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setVerifyResult(null); // Reseta resultados anteriores

    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const bytes = new Uint8Array(arrayBuffer);
      const hash = ethers.keccak256(bytes);
      setCurrentHash(hash);
      setStatus('Documento processado localmente.');
    };
    reader.readAsArrayBuffer(file);
  };

  // FLUXO 1: Registrar (Apenas Emissores)
  const registerDoc = async () => {
    if (!contract || !currentHash) {
      return setStatus('❌ Erro: Conecte a carteira e selecione um arquivo.');
    }
    setLoading(true);
    setStatus('Aguardando aprovação na MetaMask...');
    try {
      const tx = await contract.registerDocument(currentHash);
      setStatus(`⏳ Transação enviada. Minerando na Sepolia... Hash: ${tx.hash.substring(0,10)}...`);
      await tx.wait();
      setStatus(`✅ Sucesso! Documento registrado imutavelmente.`);
      setCurrentHash(''); 
      setFileName('');
    } catch (error) {
      console.error(error);
      if (error.message.includes("rejected")) {
        setStatus('⚠️ Transação cancelada pelo usuário.');
      } else if (error.message.includes("Documento ja registrado") || error.reason === "Documento ja registrado") {
        setStatus('ℹ️ Este documento já foi ancorado na Blockchain anteriormente. Acesse a aba "Validar" para consultar.');
      } else if (error.message.includes("apenas emissores autorizados")) {
        setStatus('❌ Acesso Negado: Sua carteira não tem permissão de emissão.');
      } else {
        setStatus('❌ Erro inesperado ao tentar registrar o documento.');
      }
    }
    setLoading(false);
  };

  // FLUXO 2: Verificar (Público)
  const verifyDoc = async () => {
    if (!contract || !currentHash) {
      return setStatus('❌ Erro: Conecte a carteira e selecione um arquivo.');
    }
    setLoading(true);
    setVerifyResult(null);
    setStatus('Consultando ledger na Sepolia...');
    try {
      const [exists, issuer, timestamp] = await contract.verifyDocument(currentHash);
      if (exists) {
        const date = new Date(Number(timestamp) * 1000).toLocaleString('pt-BR');
        setVerifyResult({
          status: 'valid',
          issuer,
          date,
          hash: currentHash
        });
        setStatus('✅ Consulta finalizada.');
      } else {
        setVerifyResult({ status: 'invalid', hash: currentHash });
        setStatus('❌ Documento não encontrado.');
      }
    } catch (error) {
      console.error(error);
      setStatus('❌ Erro ao consultar contrato.');
    }
    setLoading(false);
  };

  // Componente Auxiliar para o Header
  const Header = () => (
    <header className="w-full border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <ShieldCheck className="w-7 h-7 md:w-9 md:h-9 text-blue-500" />
          <h1 className="text-xl md:text-3xl font-extrabold text-white tracking-tighter truncate">
            Academi<span className="text-blue-500">Chain</span>
          </h1>
        </div>
        <button 
          onClick={handleConnect}
          className="flex items-center gap-2 px-3 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all bg-slate-800 text-slate-100 hover:bg-slate-700 active:scale-95 border border-slate-700 shrink-0"
        >
          <Wallet className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="hidden sm:inline">
            {account ? `${account.substring(0,6)}...${account.substring(38)}` : "Conectar Carteira"}
          </span>
          <span className="sm:hidden">
            {account ? `${account.substring(0,4)}...` : "Conectar"}
          </span>
        </button>
      </div>
    </header>
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 font-sans antialiased">
      <Header />
      
      <div className="max-w-5xl mx-auto pt-32 pb-16 px-6 flex flex-col items-center">
        
        {/* Sessão de Título e Abas */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-white tracking-tighter mb-4">
            Cartório Digital Descentralizado
          </h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">
            Emita e valide a autenticidade de diplomas, laudos e contratos garantidos pela imutabilidade da Blockchain Ethereum.
          </p>
        </div>

        {/* Navegação por Abas */}
        <div className="flex p-1.5 bg-slate-900 rounded-full border border-slate-800 mb-10 w-full max-w-sm shadow-inner">
          <button 
            onClick={() => { setActiveTab('emitir'); setVerifyResult(null); setCurrentHash(''); setFileName(''); setStatus(''); }}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'emitir' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-100'}`}
          >
            <UploadCloud className="w-4 h-4" />
            Emitir
          </button>
          <button 
            onClick={() => { setActiveTab('verificar'); setVerifyResult(null); setCurrentHash(''); setFileName(''); setStatus(''); }}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'verificar' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-100'}`}
          >
            <FileSearch className="w-4 h-4" />
            Validar
          </button>
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="w-full bg-slate-900 rounded-3xl border border-slate-800 p-10 shadow-2xl">
          
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800">
            {activeTab === 'emitir' ? 
              <UploadCloud className="w-10 h-10 text-blue-400" /> : 
              <FileSearch className="w-10 h-10 text-blue-400" />
            }
            <div>
              <h3 className="text-2xl font-bold text-white">
                {activeTab === 'emitir' ? 'Registrar Novo Documento' : 'Auditar Autenticidade de Arquivo'}
              </h3>
              <p className="text-slate-500 text-sm">
                {activeTab === 'emitir' ? 'Apenas instituições emissoras autorizadas.' : 'Qualquer pessoa com o arquivo original.'}
              </p>
            </div>
          </div>

          {/* Area de Upload */}
          <div className="mb-8 group">
            <label className="block text-sm font-semibold text-slate-300 mb-3">
              Arquivo Original
            </label>
            <div className="relative border-2 border-dashed border-slate-700 rounded-xl px-6 py-10 text-center bg-slate-950/50 hover:border-blue-600 hover:bg-slate-800/50 transition-all cursor-pointer">
              <input 
                type="file" 
                onChange={processFile} 
                onClick={(e) => { e.target.value = null }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <UploadCloud className="w-12 h-12 text-slate-600 mx-auto mb-4 group-hover:text-blue-500 transition-colors" />
              <p className="text-lg font-medium text-slate-300 mb-1">
                {fileName ? fileName : 'Clique ou arraste o arquivo original'}
              </p>
              <p className="text-xs text-slate-600">PDF, PNG, JPG, XML (Max. 10MB)</p>
            </div>
          </div>

          {/* Display do Hash */}
          {currentHash && (
            <div className="mb-8 p-5 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Impressão Digital (Keccak256 Hash)</span>
                <span className="text-xs text-green-400 font-medium">Gerado Localmente ✔</span>
              </div>
              <code className="text-sm text-blue-300 break-all bg-slate-800/50 p-1.5 rounded">{currentHash}</code>
            </div>
          )}

          {/* Botão de Ação Robusto COM PROTEÇÃO CONTRA HYDRATION ERROR */}
          <button 
            onClick={activeTab === 'emitir' ? registerDoc : verifyDoc}
            disabled={!mounted || !currentHash || loading || !contract}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-extrabold text-lg text-white transition-all shadow-lg active:scale-95 ${loading ? 'bg-slate-700' : 'bg-blue-600 hover:bg-blue-500'} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <> <Loader2 className="w-6 h-6 animate-spin" /> Processando... </>
            ) : activeTab === 'emitir' ? (
              <> <ShieldCheck className="w-6 h-6" /> Assinar e Ancorar na Blockchain </>
            ) : (
              <> <FileSearch className="w-6 h-6" /> Consultar Autenticidade </>
            )}
          </button>

          {/* Área de Status */}
          {status && !verifyResult && (
            <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-center text-slate-300">
              {status}
            </div>
          )}

          {/* Resultado da Verificação */}
          {verifyResult && (
            <div className={`mt-8 p-6 rounded-2xl border transition-all ${verifyResult.status === 'valid' ? 'bg-emerald-950/30 border-emerald-800/50' : 'bg-red-950/30 border-red-800/50'}`}>
              <div className="flex items-center gap-4 mb-5">
                {verifyResult.status === 'valid' ? 
                  <CheckCircle2 className="w-12 h-12 text-emerald-400" /> : 
                  <AlertTriangle className="w-12 h-12 text-red-400" />
                }
                <div>
                  <h4 className={`text-2xl font-extrabold ${verifyResult.status === 'valid' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {verifyResult.status === 'valid' ? 'Documento Autêntico' : 'Documento Inválido / Não Encontrado'}
                  </h4>
                  <p className="text-slate-400 text-sm">Resultado da auditoria criptográfica na Sepolia Testnet.</p>
                </div>
              </div>
              
              {verifyResult.status === 'valid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800/50 pt-5 text-sm">
                  <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                    <p className="text-slate-500 font-medium mb-1">Emissor Autorizado (Wallet)</p>
                    <code className="text-slate-200 break-all">{verifyResult.issuer}</code>
                  </div>
                  <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 flex items-center gap-3">
                    <CalendarDays className="w-8 h-8 text-blue-400" />
                    <div>
                      <p className="text-slate-500 font-medium mb-1">Data do Registro</p>
                      <p className="text-slate-100 font-bold text-base">{verifyResult.date}</p>
                    </div>
                  </div>
                </div>
              )}
               {verifyResult.status === 'invalid' && (
                 <p className="text-red-300 text-center bg-red-950 p-4 rounded-lg border border-red-900">
                   Atenção: O hash deste arquivo não corresponde a nenhum registro imutável no contrato inteligente AcademiChain na rede Sepolia. O arquivo pode ter sido alterado ou nunca foi registrado.
                 </p>
               )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}