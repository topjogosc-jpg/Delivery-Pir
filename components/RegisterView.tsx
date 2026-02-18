
import React from 'react';

interface RegisterViewProps {
  onSelectCustomer: () => void;
  onSelectSeller: () => void;
  onSelectLogin: () => void;
  onBack?: () => void;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onSelectCustomer, onSelectSeller, onSelectLogin, onBack }) => {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-fadeIn">
      {onBack && (
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-xs font-black uppercase tracking-widest">
          <i className="fa-solid fa-chevron-left"></i>
          Voltar ao Início
        </button>
      )}

      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter mb-4">Faça parte do Pira Certo</h2>
        <p className="text-gray-500 font-medium">Escolha como você deseja se cadastrar no maior delivery de Pirapemas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card Cliente */}
        <div 
          onClick={onSelectCustomer}
          className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:border-red-100 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-user-tag text-2xl"></i>
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">Quero ser Cliente</h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">Peça nas melhores lojas, acompanhe seus pedidos e ganhe cupons exclusivos.</p>
          <div className="inline-flex items-center gap-2 text-[#EA1D2C] font-black text-xs uppercase tracking-widest">
            Cadastrar agora
            <i className="fa-solid fa-arrow-right"></i>
          </div>
        </div>

        {/* Card Lojista */}
        <div 
          onClick={onSelectSeller}
          className="bg-gray-900 p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:bg-black transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-store text-2xl"></i>
          </div>
          <h3 className="text-xl font-black text-white mb-2">Quero vender</h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">Cadastre seu cardápio, gerencie suas vendas e cresça sua empresa em Pirapemas.</p>
          <div className="inline-flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest">
            Seja parceiro
            <i className="fa-solid fa-arrow-right"></i>
          </div>
        </div>
      </div>

      <div className="mt-16 p-8 bg-gray-50 rounded-[2rem] border border-gray-100 text-center">
        <p className="text-sm font-bold text-gray-500 mb-4">Já possui uma conta salva?</p>
        <button 
          onClick={onSelectLogin}
          className="bg-white border-2 border-gray-200 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-gray-700 hover:border-red-500 hover:text-red-500 transition-all"
        >
          Entrar na minha conta
        </button>
      </div>
    </div>
  );
};

export default RegisterView;
