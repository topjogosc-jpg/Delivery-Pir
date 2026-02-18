
import React, { useState } from 'react';
import { CartItem, PaymentMethod, Restaurant } from '../services/types.ts';

interface CartDrawerProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (method: PaymentMethod, details?: string, deliveryFee?: number) => void;
  onRemove: (id: string) => void;
  restaurants: Restaurant[];
  isRegistered: boolean;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ items, isOpen, onClose, onCheckout, onRemove, restaurants, isRegistered }) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [changeFor, setChangeFor] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const restaurantId = items[0]?.restaurantId;
  const restaurant = restaurants.find(r => r.id === restaurantId);
  const config = restaurant?.paymentConfig || { acceptsCard: true, acceptsCash: true, acceptsPix: false, pixKey: '', mercadoPagoToken: '' };
  
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const delivery = restaurant ? restaurant.deliveryFee : 0;
  const total = subtotal + delivery;

  const handleCheckoutClick = () => {
    if (!isRegistered) {
      onCheckout('card', 'force_registration');
      return;
    }
    
    let details = '';
    if (paymentMethod === 'cash' && changeFor) {
      details = `Troco para R$ ${changeFor}`;
    }
    if (paymentMethod === 'pix') {
      details = 'Pagamento via Pix';
    }
    if (paymentMethod === 'card' && config.mercadoPagoToken) {
      details = 'Processado via Mercado Pago (Seguro)';
    }
    onCheckout(paymentMethod, details, delivery);
  };

  const handleCopyPix = () => {
    if (config.pixKey) {
      navigator.clipboard.writeText(config.pixKey)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          const el = document.createElement('textarea');
          el.value = config.pixKey;
          document.body.appendChild(el);
          el.select();
          document.execCommand('copy');
          document.body.removeChild(el);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white h-full flex flex-col animate-slideLeft shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
          <button onClick={onClose} className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
            <i className="fa-solid fa-chevron-left"></i>
            <span className="font-medium text-sm">Voltar</span>
          </button>
          <h2 className="text-xl font-black flex-1">Minha Sacola</h2>
          <button onClick={onClose} className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!isRegistered && items.length > 0 && (
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3 animate-fadeIn">
              <i className="fa-solid fa-circle-info text-amber-500 mt-1"></i>
              <div>
                <p className="text-xs font-black text-amber-800 uppercase tracking-tighter">Cadastro Obrigatório</p>
                <p className="text-[10px] text-amber-700 leading-tight">Para realizar pedidos em Pirapemas, você precisa criar uma conta rápida.</p>
              </div>
            </div>
          )}

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-basket-shopping text-4xl opacity-20"></i>
              </div>
              <p className="font-medium text-center text-sm">Sua sacola está vazia.<br/><span className="text-xs opacity-60">Escolha algo delicioso primeiro!</span></p>
              <button onClick={onClose} className="bg-red-50 text-red-500 px-6 py-2 rounded-xl text-xs font-black uppercase">Ver Lojas</button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Itens Escolhidos</h3>
                    <span className="text-[10px] font-bold text-red-500">{restaurant?.name}</span>
                </div>
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 items-center group">
                    <div className="bg-red-50 px-2.5 py-1 rounded-lg text-red-600 font-black text-xs">
                      {item.quantity}x
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-800">{item.name}</h4>
                      <p className="text-[10px] text-gray-400">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-sm text-gray-900">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                      <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <i className="fa-solid fa-trash-can text-sm"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`space-y-4 pt-4 border-t border-gray-50 ${!isRegistered ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Forma de Pagamento</h3>
                  {!isRegistered && <span className="text-[9px] font-black text-red-500 uppercase tracking-tighter">Bloqueado</span>}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {config.acceptsPix && (
                    <button 
                      onClick={() => setPaymentMethod('pix')}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'pix' ? 'border-red-500 bg-red-50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <div className="flex items-center gap-3">
                        <i className="fa-brands fa-pix text-teal-500 text-lg"></i>
                        <span className="font-bold text-sm text-gray-700">Pix</span>
                      </div>
                      {paymentMethod === 'pix' && <i className="fa-solid fa-circle-check text-red-500"></i>}
                    </button>
                  )}
                  {config.acceptsCard && (
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'card' ? 'border-red-500 bg-red-50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <div className="flex items-center gap-3">
                        {config.mercadoPagoToken ? (
                           <img src="https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/5.21.22/mercadopago/logo__large@2x.png" className="w-6" alt="MP" />
                        ) : (
                          <i className="fa-solid fa-credit-card text-blue-500 text-lg"></i>
                        )}
                        <div className="text-left">
                          <span className="font-bold text-sm text-gray-700 block">Cartão</span>
                          <span className="text-[9px] text-gray-400 uppercase font-black">{config.mercadoPagoToken ? 'Checkout Seguro' : 'Na Entrega'}</span>
                        </div>
                      </div>
                      {paymentMethod === 'card' && <i className="fa-solid fa-circle-check text-red-500"></i>}
                    </button>
                  )}
                  {config.acceptsCash && (
                    <button 
                      onClick={() => setPaymentMethod('cash')}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'cash' ? 'border-red-500 bg-red-50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-money-bill-1-wave text-green-500 text-lg"></i>
                        <span className="font-bold text-sm text-gray-700">Dinheiro</span>
                      </div>
                      {paymentMethod === 'cash' && <i className="fa-solid fa-circle-check text-red-500"></i>}
                    </button>
                  )}
                </div>

                {paymentMethod === 'cash' && isRegistered && (
                  <div className="p-4 bg-gray-50 rounded-2xl space-y-2 animate-fadeIn">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Precisa de troco?</p>
                    <input 
                      type="text"
                      placeholder="Troco para quanto?"
                      value={changeFor}
                      onChange={e => setChangeFor(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>
                )}

                {paymentMethod === 'pix' && config.pixKey && isRegistered && (
                  <div className="p-4 bg-teal-50 rounded-2xl space-y-2 animate-fadeIn border border-teal-100">
                    <p className="text-[10px] font-bold text-teal-700 uppercase">Chave Pix da Loja</p>
                    <div className="flex items-center justify-between bg-white px-4 py-2 rounded-xl">
                      <code className="text-xs font-bold text-teal-800 break-all">{config.pixKey}</code>
                      <button 
                        onClick={handleCopyPix} 
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${copied ? 'bg-green-500 text-white' : 'text-teal-500 hover:bg-teal-50'}`}
                      >
                        <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                        {copied && <span className="text-[10px] font-black uppercase">Copiado</span>}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Taxa de entrega</span>
                <span className={delivery === 0 ? 'text-green-600 font-bold' : ''}>
                    {delivery === 0 ? 'Grátis' : `R$ ${delivery.toFixed(2).replace('.', ',')}`}
                </span>
              </div>
              <div className="flex justify-between font-black text-xl pt-3 text-gray-900">
                <span>Total</span>
                <span className="text-red-600">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckoutClick}
              className={`w-full py-4 rounded-2xl font-black shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
                isRegistered 
                ? 'bg-[#EA1D2C] text-white shadow-red-200 hover:bg-red-600' 
                : 'bg-gray-900 text-white shadow-gray-200 hover:bg-black'
              }`}
            >
              {isRegistered ? (
                <>
                  <i className="fa-solid fa-check-double"></i>
                  Finalizar Pedido
                </>
              ) : (
                <>
                  <i className="fa-solid fa-user-plus"></i>
                  Fazer Cadastro p/ Pedir
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
