
import React, { useState } from 'react';
import { CustomerInfo } from '../types';

interface CustomerRegistrationProps {
  onSave: (info: CustomerInfo) => void;
  onCancel: () => void;
  initialData?: CustomerInfo | null;
}

const CustomerRegistration: React.FC<CustomerRegistrationProps> = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState<CustomerInfo>(initialData || {
    name: '',
    phone: '',
    address: '',
    email: '',
    pin: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.email || formData.pin.length !== 4) {
      alert('Por favor, preencha todos os campos corretamente. O PIN deve ter 4 dígitos.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-scaleIn my-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-user-plus text-2xl"></i>
          </div>
          <h2 className="text-2xl font-black text-gray-800 italic tracking-tighter">Seu Perfil Pira</h2>
          <p className="text-sm text-gray-500">Cadastre-se para pedir e gerenciar sua conta</p>
        </div>

        {/* Aviso de Dados Corretos */}
        <div className="mb-6 bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3 animate-fadeIn">
          <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
            <i className="fa-solid fa-triangle-exclamation text-xs"></i>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Atenção Importante</p>
            <p className="text-[11px] text-amber-700 leading-tight font-medium">
              Por favor, coloque seu <strong>nome corretamente</strong> e um número de <strong>celular que esteja funcionando</strong> (WhatsApp) para que o entregador consiga te encontrar.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
            <input 
              required
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/10 text-sm font-medium"
              placeholder="Ex: Maria Oliveira"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
              <input 
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/10 text-sm font-medium"
                placeholder="maria@pira.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">PIN (4 dígitos)</label>
              <input 
                required
                type="password"
                maxLength={4}
                value={formData.pin}
                onChange={e => setFormData({...formData, pin: e.target.value.replace(/\D/g, '')})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/10 text-sm font-bold text-center tracking-widest"
                placeholder="••••"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Telefone / WhatsApp</label>
            <input 
              required
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/10 text-sm font-medium"
              placeholder="(99) 99999-9999"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Endereço de Entrega</label>
            <textarea 
              required
              rows={2}
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/10 text-sm font-medium resize-none"
              placeholder="Rua, Número, Bairro em Pirapemas"
            />
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <button 
              type="submit" 
              className="w-full py-4 bg-[#EA1D2C] text-white rounded-2xl font-black text-sm shadow-xl shadow-red-100 hover:bg-red-600 active:scale-[0.98] transition-all"
            >
              Salvar Cadastro
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
  );
};

export default CustomerRegistration;
