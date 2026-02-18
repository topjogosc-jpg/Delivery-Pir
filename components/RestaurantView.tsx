
import React, { useState } from 'react';
import { Restaurant, FoodItem, Review } from '../services/types.ts';

interface RestaurantViewProps {
  restaurant: Restaurant;
  onBack: () => void;
  onAddToCart: (item: FoodItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddReview: (restaurantId: string, review: Omit<Review, 'id' | 'date' | 'userName'>) => void;
  userName?: string;
}

const RestaurantView: React.FC<RestaurantViewProps> = ({ restaurant, onBack, onAddToCart, isFavorite, onToggleFavorite, onAddReview, userName }) => {
  const isStoreOpen = restaurant.isOpen !== false;
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Por favor, selecione uma nota de 1 a 5 estrelas.");
      return;
    }
    onAddReview(restaurant.id, { rating, comment });
    setRating(0);
    setComment('');
    setShowReviewForm(false);
  };

  const scrollToMenu = () => {
    document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="animate-slideIn pb-20">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
          <i className="fa-solid fa-chevron-left"></i>
          <span className="font-medium">Mudar de Loja</span>
        </button>
        <button 
          onClick={() => onToggleFavorite(restaurant.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${isFavorite ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-white text-gray-400 border border-gray-100 hover:border-red-200 hover:text-red-500'}`}
        >
          <i className={`fa-${isFavorite ? 'solid' : 'regular'} fa-heart`}></i>
          {isFavorite ? 'Favorito' : 'Salvar Loja'}
        </button>
      </div>

      {!isStoreOpen && (
        <div className="bg-gray-900 text-white p-4 rounded-2xl mb-6 flex items-center justify-between animate-fadeIn shadow-lg border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-moon text-yellow-400"></i>
            </div>
            <div>
              <p className="font-black text-sm uppercase tracking-tighter">Loja Fechada no momento</p>
              <p className="text-[10px] opacity-70">Aproveite para ver o cardápio e volte mais tarde!</p>
            </div>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full text-[9px] font-black uppercase">Offline</div>
        </div>
      )}

      <div className={`relative h-48 md:h-64 rounded-2xl overflow-hidden mb-6 ${!isStoreOpen ? 'grayscale opacity-80' : ''}`}>
        <img src={restaurant.image} className="w-full h-full object-cover" alt={restaurant.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
          <div className="text-white w-full">
            <div className="flex justify-between items-end">
              <div className="max-w-[70%]">
                <h1 className="text-3xl font-bold leading-tight">{restaurant.name}</h1>
                <div className="flex items-start gap-1.5 mt-2 opacity-90">
                  <i className="fa-solid fa-location-dot text-[10px] mt-1 shrink-0"></i>
                  <p className="text-xs font-medium leading-relaxed">{restaurant.address || 'Endereço não informado'}</p>
                </div>
                <div className="flex items-center gap-3 text-sm mt-3 opacity-90">
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-star text-yellow-400"></i>
                    {restaurant.rating.toFixed(1)}
                  </span>
                  <span>•</span>
                  <span>{restaurant.category}</span>
                  <span>•</span>
                  <span>{restaurant.distance}</span>
                </div>
              </div>
              <div className={`flex items-center gap-2 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg shrink-0 mb-1 ${isStoreOpen ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-200'}`}>
                <div className={`w-2 h-2 rounded-full ${isStoreOpen ? 'bg-white animate-pulse' : 'bg-gray-400'}`}></div>
                {isStoreOpen ? 'Aberta' : 'Fechada'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Botão de Atalho para o Cardápio */}
        <button 
          onClick={scrollToMenu}
          className="w-full bg-white border-2 border-red-50 text-[#EA1D2C] py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-red-50 hover:border-red-100 transition-all flex items-center justify-center gap-3"
        >
          <i className="fa-solid fa-utensils"></i>
          Ver Cardápio Completo
          <i className="fa-solid fa-chevron-down animate-bounce"></i>
        </button>

        <section className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0">
             <i className="fa-solid fa-map-location-dot text-xl"></i>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Localização do Estacionamento</h4>
            <p className="text-sm font-bold text-gray-700">{restaurant.address || 'Localização não cadastrada'}</p>
          </div>
        </section>

        <section id="menu-section" className="pt-4">
          <h2 className="text-xl font-bold mb-4">Cardápio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restaurant.menu.map(item => {
              const isAvailable = item.available !== false && isStoreOpen;
              return (
                <div key={item.id} className={`bg-white p-4 rounded-xl flex gap-4 border border-gray-100 transition-all ${(!isAvailable || !isStoreOpen) ? 'opacity-60 grayscale-[0.8]' : 'hover:shadow-sm'}`}>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                    <p className="font-bold text-gray-900 mt-2">
                      R$ {item.price.toFixed(2).replace('.', ',')}
                    </p>
                    {item.available === false && isStoreOpen && (
                      <span className="inline-block mt-2 bg-gray-100 text-gray-500 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                        Esgotado
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover" />
                    {isStoreOpen ? (
                      item.available !== false ? (
                        <button 
                          onClick={() => onAddToCart(item)}
                          className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-white text-red-500 shadow-lg px-4 py-1 rounded-full text-xs font-bold border border-red-100 hover:bg-red-50 active:scale-95 transition-all"
                        >
                          Adicionar
                        </button>
                      ) : (
                        <div className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-gray-100 text-gray-400 shadow-sm px-4 py-1 rounded-full text-[9px] font-black border border-gray-200 cursor-not-allowed uppercase">
                          Esgotado
                        </div>
                      )
                    ) : (
                      <div className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-gray-200 text-gray-400 shadow-sm px-4 py-1 rounded-full text-[9px] font-black border border-gray-300 cursor-not-allowed uppercase">
                        Loja Fechada
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Seção de Avaliações */}
        <section className="pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <i className="fa-solid fa-star text-yellow-400"></i>
              Avaliações da Galera
            </h2>
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-xs font-black uppercase hover:bg-red-100 transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-pen-to-square"></i>
              Avaliar Loja
            </button>
          </div>

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-8 animate-fadeIn">
              <h3 className="text-sm font-black text-gray-700 uppercase mb-4 tracking-widest">O que você achou desta loja?</h3>
              <div className="flex gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-2xl transition-all"
                  >
                    <i className={`fa-solid fa-star ${star <= (hoverRating || rating) ? 'text-yellow-400 scale-110' : 'text-gray-200'}`}></i>
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Conte para a gente sua experiência..."
                className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all resize-none h-24 mb-4"
              />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-[#EA1D2C] text-white py-3 rounded-2xl font-black text-xs uppercase shadow-lg shadow-red-100 hover:bg-red-600 transition-all">Enviar Avaliação</button>
                <button type="button" onClick={() => setShowReviewForm(false)} className="flex-1 bg-white border border-gray-100 text-gray-400 py-3 rounded-2xl font-black text-xs uppercase hover:bg-gray-50 transition-all">Cancelar</button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {restaurant.reviews && restaurant.reviews.length > 0 ? (
              restaurant.reviews.slice().reverse().map(review => (
                <div key={review.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-fadeIn">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-gray-800">{review.userName}</span>
                      <div className="flex gap-0.5 mt-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <i key={s} className={`fa-solid fa-star text-[10px] ${s <= review.rating ? 'text-yellow-400' : 'text-gray-100'}`}></i>
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-300 uppercase">{review.date}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed italic">"{review.comment || 'Não deixou comentário.'}"</p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200 text-gray-400 space-y-2">
                 <i className="fa-solid fa-star-half-stroke text-2xl opacity-20"></i>
                 <p className="text-xs font-medium italic">Ninguém avaliou ainda. Seja o primeiro!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RestaurantView;
