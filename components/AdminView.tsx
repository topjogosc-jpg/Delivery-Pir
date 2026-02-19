
import React, { useState, useEffect } from 'react';
import { Restaurant, FoodItem } from '../services/types.ts';
import { supabase, isSupabaseConfigured } from '../services/supabase.ts';

interface AdminViewProps {
  restaurants: Restaurant[];
  onBack: () => void;
  activeRestaurantId: string;
}

const AdminView: React.FC<AdminViewProps> = ({ restaurants, onBack, activeRestaurantId }) => {
  const targetRes = restaurants.find(r => r.id === activeRestaurantId);
  
  const [activeTab, setActiveTab] = useState<'menu' | 'settings'>('menu');
  const [isSaving, setIsSaving] = useState(false);

  const [storeInfo, setStoreInfo] = useState({ name: '', address: '', deliveryFee: '0', image: '' });
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: 'Destaques', image: '' });

  useEffect(() => {
    if (targetRes) {
      setStoreInfo({
        name: targetRes.name || '',
        address: targetRes.address || '',
        deliveryFee: targetRes.deliveryFee?.toString() || '0',
        image: targetRes.image || ''
      });
    }
  }, [targetRes?.id]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRes || !newItem.name || !newItem.price || !supabase) return;
    setIsSaving(true);

    const foodItem: FoodItem = {
      id: "item_" + Date.now(),
      name: newItem.name,
      description: newItem.description,
      price: parseFloat(newItem.price),
      category: newItem.category,
      image: newItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
      available: true 
    };

    try {
      const updatedMenu = [...(targetRes.menu || []), foodItem];
      await supabase.from('restaurants').update({ menu: updatedMenu }).eq('id', activeRestaurantId);
      setNewItem({ name: '', description: '', price: '', category: 'Destaques', image: '' });
    } catch (e) {
      alert('Erro ao salvar no Supabase.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAvailability = async (itemId: string) => {
    if (!targetRes || !supabase) return;
    const updatedMenu = targetRes.menu.map(item => item.id === itemId ? { ...item, available: !item.available } : item);
    await supabase.from('restaurants').update({ menu: updatedMenu }).eq('id', activeRestaurantId);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!targetRes || !supabase || !confirm('Excluir produto?')) return;
    const updatedMenu = targetRes.menu.filter(item => item.id !== itemId);
    await supabase.from('restaurants').update({ menu: updatedMenu }).eq('id', activeRestaurantId);
  };

  const saveStoreInfo = async () => {
    if (!targetRes || !supabase) return;
    setIsSaving(true);
    try {
      await supabase.from('restaurants').update({
        name: storeInfo.name,
        address: storeInfo.address,
        deliveryFee: parseFloat(storeInfo.deliveryFee) || 0,
        image: storeInfo.image
      }).eq('id', activeRestaurantId);
      alert('Atualizado!');
    } finally {
      setIsSaving(false);
    }
  };

  if (!targetRes) return null;

  return (
    <div className="animate-fadeIn pb-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black italic">{targetRes.name}</h1>
        <button onClick={onBack} className="text-xs font-black uppercase text-gray-400">Voltar</button>
      </div>

      <div className="flex gap-4 mb-8 border-b border-gray-100">
        <button onClick={() => setActiveTab('menu')} className={`pb-4 px-4 font-black text-xs uppercase ${activeTab === 'menu' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}>Cardápio</button>
        <button onClick={() => setActiveTab('settings')} className={`pb-4 px-4 font-black text-xs uppercase ${activeTab === 'settings' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}>Loja</button>
      </div>

      {activeTab === 'menu' && (
        <div className="space-y-8">
          <form onSubmit={handleAddItem} className="bg-white p-6 rounded-3xl border border-gray-100 space-y-4 shadow-sm">
            <h3 className="font-black text-sm uppercase">Novo Produto</h3>
            <input required type="text" placeholder="Nome" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200" />
            <input required type="number" step="0.01" placeholder="Preço" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200" />
            <button type="submit" disabled={isSaving} className="w-full bg-gray-900 text-white p-4 rounded-2xl font-black uppercase text-xs">Adicionar Produto</button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {targetRes.menu.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-3xl border border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img src={item.image} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-sm">{item.name}</h4>
                    <p className="text-xs text-red-500 font-black">R$ {item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleAvailability(item.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}><i className="fa-solid fa-eye"></i></button>
                  <button onClick={() => handleDeleteItem(item.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center"><i className="fa-solid fa-trash"></i></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 max-w-md mx-auto space-y-4">
          <input type="text" value={storeInfo.name} onChange={e => setStoreInfo({...storeInfo, name: e.target.value})} className="w-full bg-gray-50 p-3 rounded-xl" placeholder="Nome da Loja" />
          <textarea value={storeInfo.address} onChange={e => setStoreInfo({...storeInfo, address: e.target.value})} className="w-full bg-gray-50 p-3 rounded-xl" placeholder="Endereço" />
          <button onClick={saveStoreInfo} disabled={isSaving} className="w-full bg-gray-900 text-white p-4 rounded-2xl font-black">Salvar Alterações</button>
        </div>
      )}
    </div>
  );
};

export default AdminView;
