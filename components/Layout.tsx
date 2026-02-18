
import React from 'react';
import { View } from '../services/types.ts';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  setView: (view: View) => void;
  cartCount: number;
  role: 'customer' | 'seller' | null;
  onLogout: () => void;
  onLoginClick: () => void;
  onInstallClick?: () => void;
  canInstall?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setView, cartCount, role, onLogout, onLoginClick, onInstallClick, canInstall }) => {
  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0 md:pt-16">
      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-50 h-16 items-center px-8 justify-between shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="w-8 h-8 bg-[#EA1D2C] rounded-lg flex items-center justify-center text-white shadow-lg shadow-red-100">
               <i className="fa-solid fa-motorcycle text-xs"></i>
            </div>
            <h1 className="text-xl font-black text-[#EA1D2C] italic tracking-tighter">Pira Certo</h1>
          </div>
          
          {role === 'customer' && (
            <nav className="flex gap-6 font-bold text-[13px] uppercase tracking-widest">
              <button onClick={() => setView('home')} className={activeView === 'home' ? 'text-[#EA1D2C]' : 'text-gray-400 hover:text-gray-600'}>Início</button>
              <button onClick={() => setView('orders')} className={activeView === 'orders' ? 'text-[#EA1D2C]' : 'text-gray-400 hover:text-gray-600'}>Meus Pedidos</button>
            </nav>
          )}

          {!role && (
            <nav className="flex gap-6 font-bold text-[13px] uppercase tracking-widest">
              <button onClick={() => setView('home')} className={activeView === 'home' ? 'text-[#EA1D2C]' : 'text-gray-400 hover:text-gray-600'}>Lojas</button>
              <button onClick={() => setView('register')} className={activeView === 'register' ? 'text-[#EA1D2C]' : 'text-gray-400 hover:text-gray-600'}>Cadastro</button>
            </nav>
          )}

          {role === 'seller' && (
            <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Painel Parceiro</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {canInstall && onInstallClick && (
            <button 
              onClick={onInstallClick}
              className="hidden lg:flex items-center gap-2 bg-red-50 text-[#EA1D2C] px-4 py-2 rounded-xl text-xs font-black uppercase hover:bg-red-100 transition-colors"
            >
              <i className="fa-solid fa-download"></i>
              App Desktop
            </button>
          )}

          {role === 'customer' && (
            <>
              <button onClick={() => setView('search')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
              <button onClick={() => setView('profile')} className="relative p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <i className="fa-solid fa-basket-shopping text-xl"></i>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </>
          )}

          {!role && (
            <div className="flex items-center gap-2">
               <button 
                  onClick={onLoginClick}
                  className="px-5 py-2 rounded-xl font-black text-xs uppercase text-gray-400 hover:text-red-500 transition-colors"
                >
                  Entrar
                </button>
                <button 
                  onClick={() => setView('register')}
                  className="bg-[#EA1D2C] text-white px-5 py-2 rounded-xl font-black text-xs uppercase shadow-lg shadow-red-100 hover:scale-105 transition-all"
                >
                  Criar Conta
                </button>
            </div>
          )}
          
          {role && (
            <button 
              onClick={onLogout}
              className="ml-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all text-xs font-black uppercase tracking-tighter"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Sair
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-6 md:px-8">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      {(role === 'customer' || !role) && (activeView as string) !== 'register' && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.03)]">
          <button 
            onClick={() => setView('home')}
            className={`flex flex-col items-center gap-1 ${activeView === 'home' ? 'text-[#EA1D2C]' : 'text-gray-300 hover:text-gray-400'}`}
          >
            <i className="fa-solid fa-house text-lg"></i>
            <span className="text-[10px] font-black uppercase">Início</span>
          </button>
          <button 
            onClick={() => setView('search')}
            className={`flex flex-col items-center gap-1 ${activeView === 'search' ? 'text-[#EA1D2C]' : 'text-gray-300 hover:text-gray-400'}`}
          >
            <i className="fa-solid fa-magnifying-glass text-lg"></i>
            <span className="text-[10px] font-black uppercase">Busca</span>
          </button>
          
          <button 
            onClick={() => setView('register')}
            className={`flex flex-col items-center gap-1 ${activeView === 'register' ? 'text-[#EA1D2C]' : 'text-gray-300 hover:text-gray-400'}`}
          >
            <i className="fa-solid fa-user-plus text-lg"></i>
            <span className="text-[10px] font-black uppercase">Conta</span>
          </button>

          <button 
            onClick={() => setView('profile')}
            className={`flex flex-col items-center gap-1 ${activeView === 'profile' ? 'text-[#EA1D2C]' : 'text-gray-300 hover:text-gray-400'}`}
          >
            <div className="relative">
              <i className="fa-solid fa-basket-shopping text-lg"></i>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-black uppercase">Sacola</span>
          </button>
        </nav>
      )}

      {/* Seller specific Mobile Nav */}
      {role === 'seller' && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-4 flex justify-between items-center z-50 shadow-lg">
           <button onClick={() => setView('seller-dashboard')} className={`flex items-center gap-2 font-black uppercase text-xs ${activeView === 'seller-dashboard' ? 'text-red-500' : 'text-gray-400'}`}>
              <i className="fa-solid fa-chart-simple text-lg"></i>
              Vendas
           </button>
           <button onClick={() => setView('admin')} className={`flex items-center gap-2 font-black uppercase text-xs ${activeView === 'admin' ? 'text-red-500' : 'text-gray-400'}`}>
              <i className="fa-solid fa-utensils text-lg"></i>
              Cardápio
           </button>
           <button onClick={onLogout} className="flex items-center gap-2 font-black uppercase text-xs text-gray-400">
              <i className="fa-solid fa-power-off text-lg"></i>
              Sair
           </button>
        </nav>
      )}
    </div>
  );
};

export default Layout;
