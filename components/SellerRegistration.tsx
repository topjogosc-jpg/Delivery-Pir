
import React, { useState } from 'react';
import { Restaurant } from '../types';

interface SellerRegistrationProps {
  onRegister: (restaurant: Restaurant) => void;
  onCancel: () => void;
}

const SellerRegistration: React.FC<SellerRegistrationProps> = ({ onRegister, onCancel }) => {
  const [formData, setFormData] = useState({
    ownerName: '',
    ownerEmail: '',
    businessName: '',
    businessAddress: '',
    category: 'Geral',
    pin: '',
    image: '',
    pixKey: '',
    whatsappPix: '',
    mercadoPagoToken: '',
    deliveryFee: '0'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.pin.length !== 4) {
      alert('O PIN deve ter exatamente 4 dígitos.');
      return;
    }

    const newRestaurant: Restaurant = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.businessName,
      address: formData.businessAddress,
      ownerName: formData.ownerName,
      ownerEmail: formData.ownerEmail,
      category: formData.category,
      rating: 5.0,
      distance: '0.0 km',
      deliveryTime: '20-30 min',
      deliveryFee: parseFloat(formData.deliveryFee) || 0,
      image: formData.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      menu: [],
      adminPin: formData.pin,
      paymentConfig: {
        pixKey: formData.pixKey,
        whatsappPix: formData.whatsappPix,
        mercadoPagoToken: formData.mercadoPagoToken,
        acceptsCard: true,
        acceptsCash: true,
        acceptsPix: formData.pixKey.length > 0
      }
    };

    onRegister(newRestaurant);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-scaleIn my-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-800 italic tracking-tighter">Seja um Parceiro Pira</h2>
          <p className="text-sm text-gray-500">Cadastre sua empresa e comece a vender em Pirapemas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Seu Nome</label>
              <input required type="text" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none" placeholder="João Silva" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Seu Email</label>
              <input required type="email" value={formData.ownerEmail} onChange={e => setFormData({...formData, ownerEmail: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none" placeholder="joao@pira.com" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome da Empresa</label>
            <input required type="text" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none font-bold" placeholder="Pira Lanches" />
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-4">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Configuração Financeira (Mercado Pago & Pix)</p>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500">Access Token Mercado Pago (Opcional)</label>
                <input type="password" value={formData.mercadoPagoToken} onChange={e => setFormData({...formData, mercadoPagoToken: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none" placeholder="APP_USR-..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500">Chave Pix</label>
                  <input type="text" value={formData.pixKey} onChange={e => setFormData({...formData, pixKey: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none" placeholder="CPF/Email/Telefone" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500">WhatsApp Comprovantes</label>
                  <input type="tel" value={formData.whatsappPix} onChange={e => setFormData({...formData, whatsappPix: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none" placeholder="5599..." />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PIN de Acesso (4 dígitos)</label>
              <input required type="password" maxLength={4} value={formData.pin} onChange={e => setFormData({...formData, pin: e.target.value.replace(/\D/g, '')})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none text-center font-black tracking-[0.5em] text-xl" placeholder="••••" />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoria</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none text-sm font-bold">
                  <option>Lanches</option>
                  <option>Pizzas</option>
                  <option>Doces</option>
                  <option>Bebidas</option>
                  <option>Geral</option>
                </select>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button type="button" onClick={onCancel} className="flex-1 py-4 text-sm font-bold text-gray-400 hover:bg-gray-50 rounded-2xl transition-all">Cancelar</button>
            <button type="submit" className="flex-[2] py-4 text-sm font-black bg-[#EA1D2C] text-white rounded-2xl shadow-xl shadow-red-100 hover:scale-[1.02] active:scale-95 transition-all">Criar minha Loja</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerRegistration;
