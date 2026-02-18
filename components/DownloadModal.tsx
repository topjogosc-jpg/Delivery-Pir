
import React, { useState } from 'react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose, deferredPrompt }) => {
  const [copied, setCopied] = useState(false);
  const [installError, setInstallError] = useState(false);

  if (!isOpen) return null;

  const getAppUrl = () => {
    try {
      return window.top !== window.self ? window.top!.location.href : window.location.href;
    } catch {
      return window.location.href;
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getAppUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('Resultado da instalação:', outcome);
        onClose();
      } catch (err) {
        console.error('Erro ao processar instalação:', err);
        setInstallError(true);
      }
    }
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getAppUrl())}`;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl animate-scaleIn">
        <div className="bg-[#EA1D2C] p-8 text-center text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <i className="fa-solid fa-motorcycle text-[#EA1D2C] text-2xl"></i>
          </div>
          <h3 className="text-xl font-black italic tracking-tighter">Instalar Pira Certo</h3>
          <p className="text-[10px] opacity-80 font-bold uppercase mt-1 tracking-widest">Pirapemas - MA</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center space-y-4">
             <div className="bg-gray-50 p-4 rounded-3xl inline-block border border-gray-100 shadow-inner">
                <img src={qrCodeUrl} alt="QR Code do App" className="w-32 h-32" />
             </div>
             <p className="text-xs text-gray-500 leading-relaxed px-4">
                {deferredPrompt 
                  ? "Seu celular é compatível! Clique no botão abaixo para instalar." 
                  : "Use o QR Code ou o link abaixo para abrir e instalar pelo seu navegador."}
             </p>
          </div>

          <div className="space-y-3">
            {deferredPrompt ? (
              <button 
                onClick={handleInstallClick}
                className="w-full bg-[#EA1D2C] text-white py-4 rounded-2xl font-black shadow-xl shadow-red-100 hover:scale-[1.02] active:scale-95 transition-all text-xs"
              >
                Instalar no Celular
              </button>
            ) : (
              <div className="space-y-3">
                {isIOS ? (
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
                    <p className="text-[10px] font-black text-blue-600 uppercase mb-1">No iPhone (Safari)</p>
                    <p className="text-[9px] text-blue-500">Toque em <i className="fa-solid fa-arrow-up-from-bracket mx-1"></i> e selecione <strong>"Tela de Início"</strong></p>
                  </div>
                ) : isAndroid ? (
                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center">
                    <p className="text-[10px] font-black text-orange-600 uppercase mb-1">No Android (Chrome)</p>
                    <p className="text-[9px] text-orange-500">Toque nos <i className="fa-solid fa-ellipsis-vertical mx-1"></i> e selecione <strong>"Instalar Aplicativo"</strong></p>
                  </div>
                ) : null}
              </div>
            )}

            <button 
              onClick={handleCopyLink}
              className={`w-full py-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 border-2 ${copied ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-100 text-gray-800 hover:border-red-500'}`}
            >
              <i className={`fa-solid ${copied ? 'fa-check' : 'fa-link'}`}></i>
              {copied ? 'Link Copiado!' : 'Copiar Link do App'}
            </button>
          </div>

          {installError && (
            <p className="text-[9px] text-red-500 font-bold text-center animate-shake">
              Ocorreu um erro. Tente instalar manualmente pelo menu do navegador.
            </p>
          )}

          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest text-center">
            Suporte: (19) 99175-9068
          </p>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;
