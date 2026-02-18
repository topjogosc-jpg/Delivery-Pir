
import React, { useState } from 'react';

interface LandingPageProps {
  onEnterAsCustomer: () => void;
  onEnterAsPartner: () => void;
  onRegisterPartner: () => void;
  onDownloadClick: () => void;
  onEnterDevRoot?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterAsCustomer, onEnterAsPartner, onRegisterPartner, onDownloadClick, onEnterDevRoot }) => {
  const [copied, setCopied] = useState(false);
  const whatsappNumber = "5519991759068";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Olá! Gostaria de suporte sobre o Delivery Pira Certo.`;
  const devEmail = "topjogosc@gmail.com";
  
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

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden selection:bg-red-100 selection:text-red-600">
      {/* Background Decorative Elements */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Modern Glass Nav */}
      <nav className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-xl z-[250] border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#EA1D2C] to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-200 rotate-3 hover:rotate-0 transition-transform cursor-pointer">
              <i className="fa-solid fa-motorcycle text-xl"></i>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-gray-900 italic tracking-tighter leading-none">Pira Certo</h1>
              <span className="text-[9px] font-black uppercase text-red-500 tracking-[0.2em]">Delivery Oficial</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <button onClick={onEnterAsPartner} className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors">Parceiros</button>
            <button 
              onClick={onEnterAsCustomer}
              className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              Entrar no App
            </button>
          </div>

          <button onClick={onEnterAsCustomer} className="md:hidden bg-red-50 text-[#EA1D2C] px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-tighter">Entrar</button>
        </div>
      </nav>

      {/* Main Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-10">
          <div className="inline-flex items-center gap-3 bg-white border border-gray-100 px-5 py-2.5 rounded-full shadow-sm animate-fadeIn">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Suporte 24h Disponível</span>
          </div>

          <h2 className="text-6xl md:text-8xl font-black text-gray-900 leading-[0.9] tracking-tighter italic max-w-4xl animate-slideIn">
            Fome de <br/>
            <span className="bg-gradient-to-r from-[#EA1D2C] to-orange-500 bg-clip-text text-transparent">Qualidade?</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed font-medium animate-fadeIn">
            O aplicativo de delivery que mais cresce em Pirapemas. <br/>
            Segurança total, rapidez e as melhores opções na palma da sua mão.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-slideIn">
            <button 
              onClick={onEnterAsCustomer}
              className="group relative bg-[#EA1D2C] text-white px-12 py-6 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-red-200 hover:bg-red-600 transition-all flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span>Pedir Agora</span>
              <i className="fa-solid fa-chevron-right text-sm"></i>
            </button>
            <button 
              onClick={onDownloadClick}
              className="bg-white text-gray-900 border-2 border-gray-100 px-12 py-6 rounded-[2.5rem] font-black text-xl hover:border-red-500 hover:text-red-500 transition-all flex items-center justify-center gap-3"
            >
              <i className="fa-solid fa-mobile-screen"></i>
              Instalar App
            </button>
          </div>
        </div>
      </section>

      {/* Dev & Support Section (New) */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Developer Card */}
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left transition-transform hover:scale-[1.01]">
              <div className="w-24 h-24 bg-gray-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shrink-0">
                <i className="fa-solid fa-code text-4xl"></i>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Desenvolvimento</h3>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Pira Certo Team</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-center md:justify-start gap-3 text-gray-600 group">
                    <i className="fa-solid fa-envelope text-red-500"></i>
                    <a href={`mailto:${devEmail}`} className="font-bold text-sm hover:text-red-500 transition-colors">{devEmail}</a>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3 text-gray-600">
                    <i className="fa-solid fa-globe text-red-500"></i>
                    <span className="font-bold text-sm">Pirapemas - MA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-gray-900 to-black p-10 rounded-[3rem] shadow-2xl flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left transition-transform hover:scale-[1.01] text-white">
              <div className="w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-green-500/20 shrink-0">
                <i className="fa-brands fa-whatsapp text-4xl"></i>
              </div>
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <h3 className="text-2xl font-black italic tracking-tight">Suporte 24 Horas</h3>
                  <span className="bg-green-500 text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">ON</span>
                </div>
                <p className="text-sm text-gray-400 font-medium">Fale conosco agora mesmo para dúvidas, reclamações ou parcerias.</p>
                <div className="flex flex-col gap-3">
                  <a 
                    href={whatsappUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center justify-center md:justify-start gap-2 bg-green-500 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-green-600 transition-all active:scale-95"
                  >
                    <i className="fa-brands fa-whatsapp text-xl"></i>
                    (19) 99175-9068
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-8 right-8 z-[300] group"
      >
        <div className="absolute -top-12 right-0 bg-white text-gray-900 px-4 py-2 rounded-xl text-[10px] font-black shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
           Suporte 24h Online! <span className="text-green-500 ml-1">●</span>
        </div>
        <div className="bg-green-500 text-white w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-green-200 hover:scale-110 hover:-rotate-6 transition-all active:scale-95">
          <i className="fa-brands fa-whatsapp text-4xl"></i>
        </div>
      </a>

      {/* Minimal Footer with Hidden Dev Trigger */}
      <footer className="py-12 px-6 border-t border-gray-50 text-center">
        <p 
          className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] cursor-default"
          onClick={onEnterDevRoot}
        >
          &copy; {new Date().getFullYear()} Delivery Pira Certo • Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
