
import React, { useState } from 'react';
import { Restaurant } from '../services/types.ts';

interface DevAdminViewProps {
  restaurants: Restaurant[];
  setRestaurants: React.Dispatch<React.SetStateAction<Restaurant[]>>;
  onBack: () => void;
}

const DevAdminView: React.FC<DevAdminViewProps> = ({ restaurants, setRestaurants, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const deleteRestaurant = (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar esta LOJA inteira? Isso é irreversível.')) {
      setRestaurants(prev => prev.filter(r => r.id !== id));
    }
  };

  const deleteProduct = (restaurantId: string, productId: string) => {
    if (window.confirm('Deseja apagar este PRODUTO?')) {
      setRestaurants(prev => prev.map(r => {
        if (r.id === restaurantId) {
          return {
            ...r,
            menu: r.menu.filter(p => p.id !== productId)
          };
        }
        return r;
      }));
    }
  };

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.ownerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto pb-20 pt-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic">Painel Dev <span className="text-red-500">Root</span></h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Acesso Restrito ao Desenvolvedor</p>
        </div>
        <button onClick={onBack} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
          Sair do Modo Root
        </button>
      </div>

      <div className="mb-6 relative">
        <input 
          type="text" 
          placeholder="Pesquisar loja por nome ou email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all font-medium"
        />
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>

      <div className="space-y-6">
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
            <i className="fa-solid fa-ghost text-4xl text-gray-100 mb-4"></i>
            <p className="text-gray-400 font-bold">Nenhuma loja encontrada para gerenciar.</p>
          </div>
        ) : (
          filteredRestaurants.map(res => (
            <div key={res.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <img src={res.image} className="w-16 h-16 rounded-2xl object-cover border border-white shadow-sm" alt="" />
                  <div>
                    <h3 className="text-lg font-black text-gray-900">{res.name}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Proprietário: {res.ownerName || 'N/A'} ({res.ownerEmail})</p>
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">ID: {res.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => deleteRestaurant(res.id)}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-black uppercase hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-trash-can"></i>
                  Apagar Loja
                </button>
              </div>
              
              <div className="p-6">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Produtos no Cardápio ({res.menu.length})</h4>
                {res.menu.length === 0 ? (
                  <p className="text-xs italic text-gray-400">Nenhum produto cadastrado.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {res.menu.map(prod => (
                      <div key={prod.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 group">
                        <img src={prod.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800 truncate">{prod.name}</p>
                          <p className="text-[9px] font-black text-red-500 uppercase">R$ {prod.price.toFixed(2)}</p>
                        </div>
                        <button 
                          onClick={() => deleteProduct(res.id, prod.id)}
                          className="w-8 h-8 rounded-lg bg-white border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center"
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DevAdminView;
