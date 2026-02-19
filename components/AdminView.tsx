
import React, { useState, useEffect, useRef } from 'react';
import { Restaurant, FoodItem, PaymentConfig } from '../services/types.ts';

interface AdminViewProps {
  restaurants: Restaurant[];
  setRestaurants: React.Dispatch<React.SetStateAction<Restaurant[]>>;
  onBack: () => void;
  activeRestaurantId: string;
}

const AdminView: React.FC<AdminViewProps> = ({ restaurants, setRestaurants, onBack, activeRestaurantId }) => {
  const targetRes = restaurants.find(r => r.id === activeRestaurantId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storeLogoInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<'menu' | 'payments' | 'settings'>('menu');
  const [payConfig, setPayConfig] = useState<PaymentConfig>(targetRes?.paymentConfig || {
    pixKey: '',
    whatsappPix: '',
    mercadoPagoToken: '',
    acceptsCard: true,
    acceptsCash: true,
    acceptsPix: false
  });

  const [storeInfo, setStoreInfo] = useState({
    name: targetRes?.name || '',
    address: targetRes?.address || '',
    deliveryFee: targetRes?.deliveryFee?.toString() || '0',
    image: targetRes?.image || ''
  });

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Destaques',
    image: ''
  });

  useEffect(() => {
    if (targetRes?.paymentConfig) {
      setPayConfig(targetRes.paymentConfig);
    }
  }, [targetRes]);

  const toggleStoreStatus = () => {
    setRestaurants(prev => prev.map(r => 
      r.id === activeRestaurantId ? { ...r, isOpen: !r.isOpen } : r
    ));
  };

  const saveStoreInfo = () => {
    if (!targetRes) return;
    setRestaurants(prev => prev.map(r => 
      r.id === activeRestaurantId 
      ? { 
          ...r, 
          name: storeInfo.name, 
          address: storeInfo.address, 
          deliveryFee: parseFloat(storeInfo.deliveryFee) || 0,
          image: storeInfo.image 
        } 
      : r
    ));
    alert('Informações da loja atualizadas!');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'store') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'product') {
          setNewItem({ ...newItem, image: base64String });
        } else {
          setStoreInfo({ ...storeInfo, image: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const savePaymentConfig = () => {
    if (!targetRes) return;
    setRestaurants(prev => prev.map(r => 
      r.id === activeRestaurantId 
      ? { ...r, paymentConfig: { ...payConfig, acceptsPix: payConfig.pixKey.trim().length > 0 } } 
      : r
    ));
    alert('Métodos de pagamento atualizados!');
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRes || !newItem.name || !newItem.price) return;

    const foodItem: FoodItem = {
      id: "item_" + Date.now() + Math.random().toString(36).substr(2, 4),
      name: newItem.name,
      description: newItem.description,
      price: parseFloat(newItem.price),
      category: newItem.category,
      image: newItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
      available: true 
    };

    setRestaurants(prev => prev.map(r => 
      r.id === activeRestaurantId 
      ? { ...r, menu: [...r.menu, foodItem] } 
      : r
    ));

    setNewItem({ name: '', description: '', price: '', category: 'Destaques', image: '' });
    alert('Produto adicionado com sucesso!');
  };

  const toggleAvailability = (itemId: string) => {
    setRestaurants(prev => prev.map(res => {
      if (res.id === activeRestaurantId) {
        return {
          ...res,
          menu: res.menu.map(item => 
            item.id === itemId ? { ...item, available: !item.available } : item
          )
        };
      }
      return res;
    }));
  };

  const handleDeleteItem = (itemId: string) => {
    if (!activeRestaurantId) return;
    
    const confirmDelete = window.confirm('Deseja excluir este produto permanentemente?');
    if (!confirmDelete) return;

    setRestaurants(prevRestaurants => {
      return prevRestaurants.map(res => {
        if (res.id === activeRestaurantId) {
          return {
            ...res,
            menu: res.menu.filter(item => item.id !== itemId)
          };
        }
        return res;
      });
    });
  };

  const handleDeleteAllItems = () => {
    if (!activeRestaurantId) return;
    const confirmDelete = window.confirm('TEM CERTEZA? Isso irá excluir TODOS os produtos do seu cardápio permanentemente.');
    if (!confirmDelete) return;

    setRestaurants(prev => prev.map(r => 
      r.id === activeRestaurantId ? { ...r, menu: [] } : r
    ));
    alert('Cardápio limpo com sucesso!');
  };

  if (!targetRes) return null;

  return (
    <div className="animate-fadeIn pb-10">
      <div className="flex justify-between items-start mb-8 gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-800">Gerenciar Loja</h1>
          <p className="text-sm text-gray-500">{targetRes.name}</p>
          
          <div className="mt-4 inline-flex items-center gap-3 bg-white border border-gray-100 px-4 py-2 rounded-2xl shadow-sm">
            <span className={`text-[10px] font-black uppercase tracking-widest ${targetRes.isOpen ? 'text-green-500' : 'text-gray-400'}`}>
              {targetRes.isOpen ? 'Loja Aberta' : 'Loja Fechada'}
            </span>
            <button 
              onClick={toggleStoreStatus}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${targetRes.isOpen ? 'bg-green-500' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${targetRes.isOpen ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>
        </div>
        <button onClick={onBack} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
          <i className="fa-solid fa-chevron-left mr-2"></i>
          Voltar
        </button>
      </div>

      <div className="flex gap-4 mb-8 border-b border-gray-100">
        <button onClick={() => setActiveTab('menu')} className={`pb-4 px-4 font-black text-sm transition-all ${activeTab === 'menu' ? 'text-[#EA1D2C] border-b-2 border-[#EA1D2C]' : 'text-gray-400 hover:text-gray-600'}`}>Cardápio</button>
        <button onClick={() => setActiveTab('payments')} className={`pb-4 px-4 font-black text-sm transition-all ${activeTab === 'payments' ? 'text-[#EA1D2C] border-b-2 border-[#EA1D2C]' : 'text-gray-400 hover:text-gray-600'}`}>Pagamentos</button>
        <button onClick={() => setActiveTab('settings')} className={`pb-4 px-4 font-black text-sm transition-all ${activeTab === 'settings' ? 'text-[#EA1D2C] border-b-2 border-[#EA1D2C]' : 'text-gray-400 hover:text-gray-600'}`}>Dados da Loja</button>
      </div>

      {activeTab === 'settings' && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 max-w-lg mx-auto animate-fadeIn">
          <div className="space-y-4">
            <h3 className="font-black text-lg text-gray-800 flex items-center gap-2">
              <i className="fa-solid fa-gears text-[#EA1D2C]"></i>
              Configurações Gerais
            </h3>

            <div className="flex flex-col items-center gap-4 py-4 border-b border-gray-50">
               <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-red-100 shadow-lg relative group">
                  <img src={storeInfo.image} className="w-full h-full object-cover" alt="Logo da loja" />
                  <button 
                    onClick={() => storeLogoInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i className="fa-solid fa-camera text-xl"></i>
                  </button>
               </div>
               <input 
                  type="file" 
                  ref={storeLogoInputRef}
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'store')}
                  className="hidden"
               />
               <div className="flex gap-2">
                  <button 
                    onClick={() => storeLogoInputRef.current?.click()}
                    className="text-[9px] bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    <i className="fa-solid fa-upload mr-1"></i> Alterar Logo
                  </button>
               </div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Preview da Imagem</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome da Empresa</label>
              <input type="text" value={storeInfo.name} onChange={e => setStoreInfo({...storeInfo, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none font-bold" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">URL da Imagem (Logo/Fachada)</label>
              <input type="url" value={storeInfo.image} onChange={e => setStoreInfo({...storeInfo, image: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none text-sm" placeholder="https://..." />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Endereço (Ponto de Saída)</label>
              <textarea value={storeInfo.address} onChange={e => setStoreInfo({...storeInfo, address: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none text-sm h-24 resize-none" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Taxa de Entrega (R$)</label>
              <input type="number" step="0.01" value={storeInfo.deliveryFee} onChange={e => setStoreInfo({...storeInfo, deliveryFee: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none font-bold" />
            </div>
          </div>
          <button onClick={saveStoreInfo} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-black transition-all">Salvar Dados</button>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 max-w-lg mx-auto animate-fadeIn">
          <div className="space-y-6">
            <h3 className="font-black text-lg text-gray-800 flex items-center gap-2 border-b border-gray-50 pb-4">
              <i className="fa-solid fa-credit-card text-[#EA1D2C]"></i>
              Pagamentos & Integrações
            </h3>
            
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <img src="https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/5.21.22/mercadopago/logo__large@2x.png" className="w-8" alt="Mercado Pago" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-blue-900">Mercado Pago (Cartão)</h4>
                    <p className="text-[10px] text-blue-700 font-bold uppercase tracking-widest">Integração Direta</p>
                  </div>
               </div>
               
               <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Access Token (Produção)</label>
                <input 
                  type="password" 
                  value={payConfig.mercadoPagoToken} 
                  onChange={e => setPayConfig({...payConfig, mercadoPagoToken: e.target.value})} 
                  placeholder="APP_USR-..." 
                  className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 focus:outline-none text-sm font-mono" 
                />
                <p className="text-[9px] text-blue-400 italic">Encontre seu token no painel do Mercado Pago Developers em 'Credenciais'.</p>
               </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chave Pix</label>
                <input type="text" value={payConfig.pixKey} onChange={e => setPayConfig({...payConfig, pixKey: e.target.value})} placeholder="Sua chave Pix" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none text-sm" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp p/ Comprovantes (Ex: 55999...)</label>
                <input type="tel" value={payConfig.whatsappPix} onChange={e => setPayConfig({...payConfig, whatsappPix: e.target.value})} placeholder="Número com DDD" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none text-sm font-bold" />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-gray-700">Aceita Cartão (Entrega)</span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Maquininha física</span>
                </div>
                <input type="checkbox" checked={payConfig.acceptsCard} onChange={e => setPayConfig({...payConfig, acceptsCard: e.target.checked})} className="w-5 h-5 accent-[#EA1D2C]" />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="font-bold text-sm text-gray-700">Aceita Dinheiro</span>
                <input type="checkbox" checked={payConfig.acceptsCash} onChange={e => setPayConfig({...payConfig, acceptsCash: e.target.checked})} className="w-5 h-5 accent-[#EA1D2C]" />
              </div>
            </div>
          </div>
          <button onClick={savePaymentConfig} className="w-full bg-[#EA1D2C] text-white py-4 rounded-2xl font-black shadow-xl shadow-red-200 hover:bg-red-600 transition-all">Salvar Pagamentos</button>
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="space-y-8 animate-fadeIn">
          <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="font-black text-lg text-gray-800 mb-6 flex items-center gap-2">
              <i className="fa-solid fa-plus-circle text-[#EA1D2C]"></i>
              Adicionar Produto
            </h3>
            <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome do Item</label>
                  <input required type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none" placeholder="X-Burguer" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Descrição</label>
                  <textarea value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm h-24 resize-none focus:outline-none" placeholder="Ingredientes..." />
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Preço (R$)</label>
                    <input required type="number" step="0.01" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoria</label>
                    <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold">
                      <option>Destaques</option>
                      <option>Pratos</option>
                      <option>Bebidas</option>
                      <option>Sobremesas</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Imagem do Produto</label>
                    <div className="flex gap-2">
                       <button 
                         type="button"
                         onClick={() => fileInputRef.current?.click()}
                         className="flex-1 bg-gray-100 border border-gray-200 rounded-xl py-3 px-4 text-xs font-black uppercase text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center gap-2"
                       >
                         <i className="fa-solid fa-camera"></i>
                         Tirar Foto / Galeria
                       </button>
                       <input 
                         type="file" 
                         ref={fileInputRef}
                         accept="image/*"
                         capture="environment"
                         onChange={(e) => handleImageUpload(e, 'product')}
                         className="hidden"
                       />
                    </div>
                    {newItem.image && (
                      <div className="mt-2 relative w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                        <img src={newItem.image} className="w-full h-full object-cover" alt="Preview" />
                        <button 
                          type="button"
                          onClick={() => setNewItem({...newItem, image: ''})}
                          className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center text-[8px]"
                        >
                          <i className="fa-solid fa-x"></i>
                        </button>
                      </div>
                    )}
                    <p className="text-[9px] text-gray-400 mt-1 italic">Ou insira uma URL abaixo:</p>
                    <input type="url" value={newItem.image.startsWith('data:') ? '' : newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none" placeholder="https://..." />
                </div>
                <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-black transition-all">Adicionar Produto</button>
              </div>
            </form>
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-black text-lg text-gray-800">Itens no Cardápio ({targetRes.menu.length})</h3>
              {targetRes.menu.length > 0 && (
                <button onClick={handleDeleteAllItems} className="text-[10px] font-black text-red-500 uppercase border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50">Excluir Todos</button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {targetRes.menu.map(item => (
                <div key={item.id} className={`bg-white p-4 rounded-3xl border transition-all flex gap-4 items-center shadow-sm group ${item.available === false ? 'opacity-60 border-gray-100' : 'border-gray-100 hover:border-[#EA1D2C]/30'}`}>
                  <img src={item.image} className="w-16 h-16 rounded-2xl object-cover" alt={item.name} />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-sm truncate">{item.name}</h4>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${item.available === false ? 'text-gray-400' : 'text-[#EA1D2C]'}`}>{item.available === false ? 'Indisponível' : 'Disponível'}</p>
                    <p className="text-gray-900 font-black text-sm">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => toggleAvailability(item.id)} className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${item.available === false ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-green-600'}`}><i className={`fa-solid ${item.available === false ? 'fa-eye' : 'fa-eye-slash'}`}></i></button>
                    <button onClick={() => handleDeleteItem(item.id)} className="w-10 h-10 rounded-2xl bg-red-50 text-[#EA1D2C] flex items-center justify-center"><i className="fa-solid fa-trash-can"></i></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminView;
