
import React from 'react';
import { Restaurant } from '../services/types.ts';

interface HomeViewProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (r: Restaurant) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onBackToLanding?: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ restaurants, onSelectRestaurant, favorites, onToggleFavorite, onBackToLanding }) => {
  const favoriteRestaurants = restaurants.filter(r => favorites.includes(r.id));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Botão de Retorno à Landing Page */}
      {onBackToLanding && (
        <div className="px-1">
          <button onClick={onBackToLanding} className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-xs font-black uppercase tracking-widest">
            <i className="fa-solid fa-chevron-left"></i>
            Início
          </button>
        </div>
      )}

      {/* Promotion Slider */}
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 pt-2">
        <div className="min-w-[85%] md:min-w-[45%] h-32 md:h-40 bg-[#EA1D2C] rounded-2xl p-6 text-white flex justify-between items-center shadow-xl shadow-red-100/50">
          <div>
            <h3 className="text-xl font-black italic leading-tight uppercase tracking-tighter">Taxa Grátis</h3>
            <p className="text-sm opacity-90 mt-1">Primeiro pedido no Pira</p>
          </div>
          <i className="fa-solid fa-motorcycle text-5xl opacity-40"></i>
        </div>
        <div className="min-w-[85%] md:min-w-[45%] h-32 md:h-40 bg-purple-600 rounded-2xl p-6 text-white flex justify-between items-center shadow-xl shadow-purple-100/50">
          <div>
            <h3 className="text-xl font-black italic leading-tight uppercase tracking-tighter">Cupom R$15</h3>
            <p className="text-sm opacity-90 mt-1">Válido em todo menu</p>
          </div>
          <i className="fa-solid fa-ticket text-5xl opacity-40 rotate-12"></i>
        </div>
      </div>

      {/* Favorites Section */}
      {favoriteRestaurants.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-black text-xl px-1 text-gray-800 flex items-center gap-2">
            <i className="fa-solid fa-heart text-red-500"></i>
            Meus Favoritos
          </h2>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 px-1">
            {favoriteRestaurants.map(res => (
              <div 
                key={res.id}
                onClick={() => onSelectRestaurant(res)}
                className="min-w-[140px] bg-white p-3 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-all flex flex-col items-center text-center gap-2"
              >
                <img src={res.image} alt={res.name} className="w-16 h-16 rounded-full object-cover border-2 border-red-50" />
                <h3 className="font-bold text-[10px] text-gray-900 truncate w-full">{res.name}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Restaurants List */}
      <section className="space-y-4">
        <h2 className="font-black text-xl px-1 text-gray-800">Lojas em Pirapemas</h2>
        {restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restaurants.map(res => (
              <div 
                key={res.id}
                className={`bg-white p-4 rounded-3xl flex gap-4 cursor-pointer hover:shadow-xl transition-all border border-gray-100 group relative ${res.isOpen === false ? 'opacity-60 grayscale-[0.5]' : ''}`}
                onClick={() => onSelectRestaurant(res)}
              >
                <div className="relative overflow-hidden rounded-2xl shrink-0">
                  <img src={res.image} alt={res.name} className="w-24 h-24 object-cover group-hover:scale-110 transition-transform duration-500" />
                  {res.isOpen === false && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-[8px] font-black text-white uppercase tracking-tighter bg-gray-900/80 px-2 py-1 rounded">Fechado</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-bold text-gray-900 group-hover:text-[#EA1D2C] transition-colors truncate">{res.name}</h3>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(res.id);
                      }}
                      className={`p-2 rounded-full transition-all ${favorites.includes(res.id) ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:text-red-300'}`}
                    >
                      <i className={`fa-${favorites.includes(res.id) ? 'solid' : 'regular'} fa-heart`}></i>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-1 truncate">
                    <i className="fa-solid fa-location-dot text-[8px]"></i>
                    <span className="truncate">{res.address || 'Pirapemas, MA'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[12px] text-gray-500">
                    <span className="flex items-center gap-1 text-yellow-500 font-bold">
                      <i className="fa-solid fa-star text-[10px]"></i>
                      {res.rating}
                    </span>
                    <span>•</span>
                    <span className="font-medium">{res.category}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[12px] mt-1">
                    <i className="fa-regular fa-clock text-gray-400 text-[10px]"></i>
                    <span className="text-gray-400">{res.deliveryTime}</span>
                    <span>•</span>
                    {res.deliveryFee === 0 ? (
                      <span className="text-green-600 font-black flex items-center gap-1">
                        <i className="fa-solid fa-truck-fast text-[10px]"></i>
                        GRÁTIS
                      </span>
                    ) : (
                      <span className="text-gray-500 font-bold">
                        R$ {res.deliveryFee.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-gray-100 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
              <i className="fa-solid fa-store-slash text-3xl text-gray-200"></i>
            </div>
            <div>
              <p className="font-black text-gray-400 text-lg">Nenhuma loja cadastrada</p>
              <p className="text-sm text-gray-300">Seja o primeiro parceiro de Pirapemas!</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomeView;
