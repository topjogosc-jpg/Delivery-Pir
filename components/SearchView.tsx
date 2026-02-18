
import React, { useState } from 'react';
import { getFoodRecommendations } from '../services/geminiService.ts';
import { Restaurant } from '../services/types.ts';

interface SearchViewProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (r: Restaurant) => void;
  onBack?: () => void;
}

const SearchView: React.FC<SearchViewProps> = ({ restaurants, onSelectRestaurant, onBack }) => {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAISearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const results = await getFoodRecommendations(query);
    setRecommendations(results);
    setLoading(false);
  };

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(query.toLowerCase()) || 
    r.category.toLowerCase().includes(query.toLowerCase()) ||
    recommendations.some(rec => r.category.toLowerCase().includes(rec.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-xs font-black uppercase tracking-widest px-1">
          <i className="fa-solid fa-chevron-left"></i>
          Voltar para Home
        </button>
      )}

      <div className="relative">
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busque por pratos ou restaurantes..."
          className="w-full bg-white border border-gray-200 rounded-2xl py-5 pl-14 pr-4 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all text-lg shadow-sm"
        />
        <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
        <button 
          onClick={handleAISearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
        >
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          PIRA AI
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center py-12 gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-red-100 rounded-full"></div>
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-gray-500 font-medium italic animate-pulse">Consultando o mestre Pira...</p>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-4 bg-red-50/50 p-6 rounded-3xl border border-red-100/50">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-star text-red-500 text-sm"></i>
            <h3 className="text-xs font-black text-red-800 uppercase tracking-widest">Sugerido pela nossa IA</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendations.map((rec, i) => (
              <button 
                key={i} 
                onClick={() => setQuery(rec)}
                className="bg-white text-red-600 px-4 py-2 rounded-xl text-xs font-bold border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                {rec}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-black text-gray-800 flex items-center gap-2 px-1">
          {query ? `Resultados para "${query}"` : 'Principais buscas'}
        </h3>
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRestaurants.map(res => (
              <div 
                key={res.id}
                onClick={() => onSelectRestaurant(res)}
                className="bg-white p-5 rounded-2xl flex gap-4 cursor-pointer hover:shadow-xl border border-gray-100 transition-all group"
              >
                <img src={res.image} alt={res.name} className="w-16 h-16 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                <div className="flex flex-col justify-center">
                  <h4 className="font-bold group-hover:text-red-500 transition-colors">{res.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{res.category} • {res.distance} • <span className="text-yellow-500 font-bold">{res.rating}★</span></p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 space-y-2">
            <i className="fa-solid fa-face-frown text-4xl opacity-20"></i>
            <p className="font-medium">Nenhuma loja encontrada para sua busca.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchView;
