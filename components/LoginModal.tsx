
import React, { useState } from 'react';
import { Restaurant, CustomerInfo } from '../services/types.ts';

interface LoginModalProps {
  restaurants: Restaurant[];
  customerInfo: CustomerInfo | null;
  onLoginSuccess: (role: 'customer' | 'seller', data: Restaurant | CustomerInfo) => void;
  onCancel: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ restaurants, customerInfo, onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Tenta logar como Lojista
    const sellerRes = restaurants.find(r => 
      r.ownerEmail?.toLowerCase() === email.toLowerCase() && 
      r.adminPin === pin
    );
    
    if (sellerRes) {
      onLoginSuccess('seller', sellerRes);
      return;
    }

    // 2. Tenta logar como Cliente
    if (customerInfo && 
        customerInfo.email.toLowerCase() === email.toLowerCase() && 
        customerInfo.pin === pin) {
      onLoginSuccess('customer', customerInfo);
      return;
    }

    // Se não encontrar nenhum
    setError(true);
    setPin('');
    setTimeout(() => setError(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-scaleIn">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-[#EA1D2C] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-100">
            <i className="fa-solid fa-right-to-bracket text-2xl"></i>
          </div>
          <h2 className="text-xl font-black text-gray-800 italic tracking-tighter">Entrar no Pira Certo</h2>
          <p className="text-sm text-gray-500">Acesse sua conta de cliente ou parceiro</p>
          
          <form onSubmit={handleSubmit} className="w-full mt-4 space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">E-mail</label>
              <input 
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/10 text-sm font-medium"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">PIN de 4 dígitos</label>
              <input 
                required
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className={`w-full text-center text-3xl tracking-[0.5em] font-black py-4 border-2 rounded-2xl focus:outline-none transition-colors ${error ? 'border-red-500 bg-red-50' : 'border-gray-100 focus:border-[#EA1D2C]'}`}
              />
            </div>
            
            {error && <p className="text-red-500 text-[10px] font-black uppercase animate-shake">Dados de acesso inválidos!</p>}
            
            <div className="grid grid-cols-1 gap-2 mt-6">
              <button 
                type="submit"
                disabled={pin.length < 4 || !email}
                className="w-full py-4 text-sm font-black bg-[#EA1D2C] text-white rounded-2xl shadow-xl shadow-red-100 hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
              >
                Entrar
              </button>
              <button 
                type="button"
                onClick={onCancel}
                className="w-full py-3 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
