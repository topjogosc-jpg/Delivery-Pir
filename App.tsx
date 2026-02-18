
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import HomeView from './components/HomeView.tsx';
import SearchView from './components/SearchView.tsx';
import RestaurantView from './components/RestaurantView.tsx';
import CartDrawer from './components/CartDrawer.tsx';
import LoginModal from './components/LoginModal.tsx';
import AdminView from './components/AdminView.tsx';
import SellerDashboard from './components/SellerDashboard.tsx';
import SellerRegistration from './components/SellerRegistration.tsx';
import OrderTracking from './components/OrderTracking.tsx';
import CustomerRegistration from './components/CustomerRegistration.tsx';
import LandingPage from './components/LandingPage.tsx';
import DownloadModal from './components/DownloadModal.tsx';
import RegisterView from './components/RegisterView.tsx';
import DevAdminView from './components/DevAdminView.tsx';
import { View, Restaurant, FoodItem, CartItem, Order, UserRole, PaymentMethod, CustomerInfo, Review } from './services/types.ts';
import { MOCK_RESTAURANTS } from './constants.tsx';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(() => {
    return localStorage.getItem('pira_session_role') as UserRole || null;
  });
  
  const [currentView, setCurrentView] = useState<View>(() => {
    return localStorage.getItem('pira_session_view') as View || 'home';
  });

  const [hasEntered, setHasEntered] = useState(() => {
    return !!localStorage.getItem('pira_session_role');
  });

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    const saved = localStorage.getItem('pira_database_restaurants');
    return saved ? JSON.parse(saved) : MOCK_RESTAURANTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('pira_database_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('pira_database_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(() => {
    const saved = localStorage.getItem('pira_database_customer_info');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeRestaurantId, setActiveRestaurantId] = useState<string | null>(() => {
    return localStorage.getItem('pira_session_active_res');
  });

  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(() => {
    return localStorage.getItem('pira_session_selected_res');
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('pira_current_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSellerRegister, setShowSellerRegister] = useState(false);
  const [showCustomerRegister, setShowCustomerRegister] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('pira_database_restaurants', JSON.stringify(restaurants));
  }, [restaurants]);

  useEffect(() => {
    localStorage.setItem('pira_database_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('pira_database_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('pira_current_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (role) localStorage.setItem('pira_session_role', role);
    else localStorage.removeItem('pira_session_role');
  }, [role]);

  useEffect(() => {
    localStorage.setItem('pira_session_view', currentView);
  }, [currentView]);

  useEffect(() => {
    if (activeRestaurantId) localStorage.setItem('pira_session_active_res', activeRestaurantId);
    else localStorage.removeItem('pira_session_active_res');
  }, [activeRestaurantId]);

  useEffect(() => {
    if (selectedRestaurantId) localStorage.setItem('pira_session_selected_res', selectedRestaurantId);
    else localStorage.removeItem('pira_session_selected_res');
  }, [selectedRestaurantId]);

  useEffect(() => {
    if (customerInfo) {
      localStorage.setItem('pira_database_customer_info', JSON.stringify(customerInfo));
    }
  }, [customerInfo]);

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => {
      if (prev.includes(id)) return prev.filter(fid => fid !== id);
      return [...prev, id];
    });
  };

  const handleAddReview = (restaurantId: string, reviewData: Omit<Review, 'id' | 'date' | 'userName'>) => {
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      userName: customerInfo?.name || 'Visitante',
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toLocaleDateString('pt-BR')
    };

    setRestaurants(prev => prev.map(res => {
      if (res.id === restaurantId) {
        const reviews = [...(res.reviews || []), newReview];
        const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
        return {
          ...res,
          reviews,
          rating: averageRating
        };
      }
      return res;
    }));
  };

  const handleSaveCustomerInfo = (info: CustomerInfo) => {
    setCustomerInfo(info);
    setRole('customer');
    setHasEntered(true);
    setShowCustomerRegister(false);
  };

  const handleLoginSuccess = (loginRole: 'customer' | 'seller', data: Restaurant | CustomerInfo) => {
    if (loginRole === 'seller') {
      const res = data as Restaurant;
      setActiveRestaurantId(res.id);
      setRole('seller');
      setCurrentView('seller-dashboard');
    } else {
      const info = data as CustomerInfo;
      setCustomerInfo(info);
      setRole('customer');
      setCurrentView('home');
    }
    setHasEntered(true);
    setShowLoginModal(false);
  };

  const handleSelectRestaurant = (r: Restaurant) => {
    setSelectedRestaurantId(r.id);
    setCurrentView('restaurant');
  };

  const currentRestaurant = restaurants.find(r => r.id === selectedRestaurantId);

  const addToCart = (item: FoodItem) => {
    if (!currentRestaurant) return;
    if (currentRestaurant.isOpen === false) {
      alert("Esta loja está fechada no momento.");
      return;
    }
    if (cart.length > 0 && cart[0].restaurantId !== currentRestaurant.id) {
      const confirmClear = window.confirm(
        `Você já possui itens de "${cart[0].restaurantName}" na sacola. Deseja iniciar um novo pedido em "${currentRestaurant.name}"?`
      );
      if (!confirmClear) return;
      setCart([]);
    }
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { 
        ...item, 
        quantity: 1, 
        restaurantId: currentRestaurant.id, 
        restaurantName: currentRestaurant.name 
      }];
    });
    setIsCartOpen(true);
  };

  const handleCheckout = (method: PaymentMethod, details?: string, deliveryFee: number = 0) => {
    if (!customerInfo || details === 'force_registration') {
      setIsCartOpen(false);
      setShowCustomerRegister(true);
      return;
    }

    if (cart.length === 0) return;

    const firstItem = cart[0];
    const restaurant = restaurants.find(r => r.id === firstItem.restaurantId);
    const now = new Date();
    const orderId = Math.random().toString(36).substr(2, 5).toUpperCase();
    
    const newOrder: Order = {
      id: orderId,
      restaurantId: firstItem.restaurantId,
      date: now.toLocaleDateString('pt-BR'),
      timestamp: now.getTime(),
      restaurantName: firstItem.restaurantName,
      total: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) + deliveryFee,
      items: [...cart],
      status: 'pending',
      paymentMethod: method,
      paymentDetails: details,
      customerInfo: customerInfo
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setIsCartOpen(false);
    setCurrentView('orders');

    sendAppNotification('Pedido Confirmado!', `Seu pedido #${orderId} foi enviado para ${firstItem.restaurantName}.`);

    if (method === 'pix' && restaurant?.paymentConfig?.whatsappPix) {
      const itemsList = newOrder.items.map(i => `${i.quantity}x ${i.name}`).join('\n');
      const text = encodeURIComponent(
        `🍕 *NOVO PEDIDO - PIRA CERTO*\n\n` +
        `👤 *Cliente:* ${customerInfo.name}\n` +
        `🆔 *Pedido:* #${orderId}\n` +
        `💰 *Total:* R$ ${newOrder.total.toFixed(2).replace('.', ',')}\n\n` +
        `📋 *Itens:*\n${itemsList}\n\n` +
        `📍 *Endereço:* ${customerInfo.address}\n\n` +
        `✅ *PAGAMENTO:* VIA PIX\n` +
        `🖼️ *ESTOU ENVIANDO O COMPROVANTE ABAIXO:*`
      );
      
      const whatsappUrl = `https://wa.me/${restaurant.paymentConfig.whatsappPix}?text=${text}`;
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 500);
    }
  };

  const sendAppNotification = (title: string, body: string) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        body
      });
    } else if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, status } : o);
      const order = updated.find(o => o.id === orderId);
      
      if (order) {
        let msgBody = '';
        switch(status) {
          case 'preparing': msgBody = `Seu pedido de ${order.restaurantName} está sendo preparado!`; break;
          case 'ready': msgBody = `Seu pedido em ${order.restaurantName} está pronto para sair!`; break;
          case 'delivering': msgBody = `O entregador saiu com seu pedido de ${order.restaurantName}!`; break;
          case 'completed': msgBody = `Pedido de ${order.restaurantName} entregue. Bom apetite!`; break;
          case 'rejected': msgBody = `Infelizmente seu pedido em ${order.restaurantName} foi cancelado.`; break;
        }
        if (msgBody) sendAppNotification('Atualização de Pedido', msgBody);
      }
      
      return updated;
    });
  };

  const handleSellerRegister = (newRes: Restaurant) => {
    setRestaurants(prev => [...prev, { ...newRes, isOpen: true }]);
    setActiveRestaurantId(newRes.id);
    setRole('seller');
    setHasEntered(true);
    setShowSellerRegister(false);
    setCurrentView('seller-dashboard');
  };

  const handleLogout = () => {
    setRole(null);
    setHasEntered(false);
    setActiveRestaurantId(null);
    setSelectedRestaurantId(null);
    setCurrentView('home');
    setShowLoginModal(false);
    setShowSellerRegister(false);
    setShowCustomerRegister(false);
    
    localStorage.removeItem('pira_session_role');
    localStorage.removeItem('pira_session_active_res');
    localStorage.removeItem('pira_session_selected_res');
  };

  // Função discreta para entrar no painel de dev
  const handleEnterDevRoot = () => {
    const pass = window.prompt('Acesso Root - Digite a senha de administrador:');
    if (pass === '0382690') {
      setCurrentView('dev-admin');
    } else if (pass !== null) {
      alert('Acesso negado.');
    }
  };

  if (!role && !hasEntered && currentView === 'home') {
    return (
      <>
        <LandingPage 
          onEnterAsCustomer={() => setHasEntered(true)} 
          onEnterAsPartner={() => setShowLoginModal(true)}
          onRegisterPartner={() => setCurrentView('register')}
          onDownloadClick={() => setIsDownloadModalOpen(true)}
          onEnterDevRoot={handleEnterDevRoot}
        />
        <DownloadModal 
          isOpen={isDownloadModalOpen} 
          onClose={() => setIsDownloadModalOpen(false)} 
          deferredPrompt={deferredPrompt} 
        />
        {showLoginModal && (
          <LoginModal 
            restaurants={restaurants} 
            customerInfo={customerInfo}
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setShowLoginModal(false)} 
          />
        )}
      </>
    );
  }

  return (
    <Layout 
      activeView={currentView} 
      setView={(v) => {
        if (v === 'profile' && role === 'customer') setIsCartOpen(true);
        else setCurrentView(v);
      }} 
      cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
      role={role}
      onLogout={handleLogout}
      onLoginClick={() => setShowLoginModal(true)}
      canInstall={!!deferredPrompt}
      onInstallClick={() => setIsDownloadModalOpen(true)}
    >
      <div className="pb-10 pt-4">
        {currentView === 'dev-admin' && (
          <DevAdminView 
            restaurants={restaurants} 
            setRestaurants={setRestaurants} 
            onBack={() => setCurrentView('home')} 
          />
        )}

        {currentView === 'register' && !role && (
          <RegisterView 
            onSelectCustomer={() => setShowCustomerRegister(true)}
            onSelectSeller={() => setShowSellerRegister(true)}
            onSelectLogin={() => setShowLoginModal(true)}
            onBack={() => {
              if (role) setCurrentView('home');
              else setHasEntered(false);
            }}
          />
        )}

        {(role === 'customer' || !role) && currentView !== 'register' && currentView !== 'dev-admin' && (
          <>
            {customerInfo && (
              <div className="px-1 mb-6 flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm animate-fadeIn">
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-gray-400">Entregar em:</span>
                    <span className="text-sm font-bold text-gray-800 truncate max-w-[200px] md:max-w-md">{customerInfo.address}</span>
                  </div>
                </div>
                <button onClick={() => setShowCustomerRegister(true)} className="text-[10px] bg-gray-50 text-gray-400 px-3 py-1 rounded-lg font-black uppercase hover:bg-red-50 hover:text-red-500 transition-all">Alterar</button>
              </div>
            )}

            {currentView === 'home' && (
              <HomeView 
                restaurants={restaurants} 
                onSelectRestaurant={handleSelectRestaurant} 
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onBackToLanding={!role ? () => setHasEntered(false) : undefined}
              />
            )}
            {currentView === 'search' && (
              <SearchView 
                restaurants={restaurants} 
                onSelectRestaurant={handleSelectRestaurant} 
                onBack={() => setCurrentView('home')}
              />
            )}
            {currentView === 'restaurant' && currentRestaurant && (
              <RestaurantView 
                restaurant={currentRestaurant} 
                onBack={() => setCurrentView('home')} 
                onAddToCart={addToCart} 
                isFavorite={favorites.includes(currentRestaurant.id)}
                onToggleFavorite={handleToggleFavorite}
                onAddReview={handleAddReview}
                userName={customerInfo?.name}
              />
            )}
            {currentView === 'orders' && (
              <div className="space-y-6 animate-fadeIn">
                <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-xs font-black uppercase tracking-widest px-1">
                  <i className="fa-solid fa-chevron-left"></i>
                  Voltar para Lojas
                </button>

                <div className="flex justify-between items-end mb-2">
                   <h1 className="text-3xl font-black text-gray-800 italic tracking-tighter">Meus Pedidos</h1>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{orders.length} pedidos totais</p>
                </div>
                {orders.length === 0 ? (
                  <div className="bg-white p-16 rounded-[2.5rem] text-center space-y-4 border-2 border-dashed border-gray-100">
                     <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                        <i className="fa-solid fa-receipt text-4xl"></i>
                     </div>
                     <p className="font-bold text-gray-400">Você ainda não fez nenhum pedido.</p>
                     <button onClick={() => setCurrentView('home')} className="bg-[#EA1D2C] text-white px-6 py-2 rounded-xl text-xs font-black uppercase shadow-lg shadow-red-100">Começar a comprar</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{order.restaurantName}</h3>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">#{order.id} • {order.date}</span>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${order.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-500 animate-pulse'}`}>
                             {order.status === 'completed' ? 'Concluído' : 'Em andamento'}
                          </div>
                        </div>
                        <OrderTracking status={order.status} />
                        <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                          <span className="text-xs text-gray-400 font-medium">{order.items.length} itens</span>
                          <span className="text-gray-900 font-black text-lg">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {role === 'seller' && activeRestaurantId && currentView !== 'dev-admin' && (
          <>
            {currentView === 'seller-dashboard' && (
              <SellerDashboard 
                orders={orders.filter(o => o.restaurantId === activeRestaurantId)}
                restaurants={restaurants.filter(r => r.id === activeRestaurantId)} 
                updateOrderStatus={updateOrderStatus}
                onManageLojas={() => setCurrentView('admin')}
              />
            )}
            {currentView === 'admin' && (
              <AdminView 
                restaurants={restaurants} 
                setRestaurants={setRestaurants} 
                activeRestaurantId={activeRestaurantId}
                onBack={() => setCurrentView('seller-dashboard')} 
              />
            )}
          </>
        )}
      </div>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onRemove={(id) => setCart(c => c.filter(x => x.id !== id))} 
        onCheckout={handleCheckout} 
        restaurants={restaurants} 
        isRegistered={!!customerInfo}
      />
      
      {showLoginModal && (
        <LoginModal 
          restaurants={restaurants} 
          customerInfo={customerInfo}
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => setShowLoginModal(false)} 
        />
      )}
      
      {showSellerRegister && (
        <SellerRegistration 
          onRegister={handleSellerRegister} 
          onCancel={() => setShowSellerRegister(false)} 
        />
      )}

      {showCustomerRegister && (
        <CustomerRegistration 
          initialData={customerInfo}
          onSave={handleSaveCustomerInfo} 
          onCancel={() => setShowCustomerRegister(false)} 
        />
      )}

      <DownloadModal 
        isOpen={isDownloadModalOpen} 
        onClose={() => setIsDownloadModalOpen(false)} 
        deferredPrompt={deferredPrompt} 
      />
    </Layout>
  );
};

export default App;
