
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
import { db, collection, doc, setDoc, updateDoc, onSnapshot, query, where, orderBy, getDocs, addDoc } from './services/firebase.ts';

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
  
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
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
  const [isLoading, setIsLoading] = useState(true);

  // 1. SINCRONIZAR RESTAURANTES
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "restaurants"), (snapshot) => {
      const resList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Restaurant));
      setRestaurants(resList.length > 0 ? resList : MOCK_RESTAURANTS);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. SINCRONIZAR PEDIDOS EM TEMPO REAL
  useEffect(() => {
    let q;
    if (role === 'seller' && activeRestaurantId) {
      q = query(collection(db, "orders"), where("restaurantId", "==", activeRestaurantId), orderBy("timestamp", "desc"));
    } else if (role === 'customer' && customerInfo) {
      q = query(collection(db, "orders"), where("customerInfo.email", "==", customerInfo.email), orderBy("timestamp", "desc"));
    } else {
      return;
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orderList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(orderList);
    }, (error) => {
      console.error("Erro ao carregar pedidos em tempo real:", error);
    });

    return () => unsubscribe();
  }, [role, activeRestaurantId, customerInfo]);

  // Persistência de LocalStorage para UI
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

  const handleAddReview = async (restaurantId: string, reviewData: Omit<Review, 'id' | 'date' | 'userName'>) => {
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      userName: customerInfo?.name || 'Visitante',
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toLocaleDateString('pt-BR')
    };

    const res = restaurants.find(r => r.id === restaurantId);
    if (!res) return;

    const reviews = [...(res.reviews || []), newReview];
    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    try {
      await updateDoc(doc(db, "restaurants", restaurantId), {
        reviews,
        rating: averageRating
      });
    } catch (e) {
      console.error("Erro ao salvar avaliação:", e);
    }
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

  const handleCheckout = async (method: PaymentMethod, details?: string, deliveryFee: number = 0) => {
    if (!customerInfo || details === 'force_registration') {
      setIsCartOpen(false);
      setShowCustomerRegister(true);
      return;
    }

    if (cart.length === 0) return;

    const firstItem = cart[0];
    const restaurant = restaurants.find(r => r.id === firstItem.restaurantId);
    const now = new Date();
    
    const newOrderData = {
      restaurantId: firstItem.restaurantId,
      date: now.toLocaleDateString('pt-BR'),
      timestamp: now.getTime(),
      restaurantName: firstItem.restaurantName,
      total: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) + deliveryFee,
      items: [...cart],
      status: 'pending',
      paymentMethod: method,
      paymentDetails: details || "",
      customerInfo: customerInfo
    };

    try {
      const docRef = await addDoc(collection(db, "orders"), newOrderData);
      const orderId = docRef.id.substring(0, 5).toUpperCase();
      
      setCart([]);
      setIsCartOpen(false);
      setCurrentView('orders');

      sendAppNotification('Pedido Confirmado!', `Seu pedido #${orderId} foi enviado para ${firstItem.restaurantName}.`);

      if (method === 'pix' && restaurant?.paymentConfig?.whatsappPix) {
        const itemsList = cart.map(i => `${i.quantity}x ${i.name}`).join('\n');
        const text = encodeURIComponent(
          `🍕 *NOVO PEDIDO - PIRA CERTO*\n\n` +
          `👤 *Cliente:* ${customerInfo.name}\n` +
          `🆔 *Pedido:* #${orderId}\n` +
          `💰 *Total:* R$ ${newOrderData.total.toFixed(2).replace('.', ',')}\n\n` +
          `📋 *Itens:*\n${itemsList}\n\n` +
          `📍 *Endereço:* ${customerInfo.address}\n\n` +
          `✅ *PAGAMENTO:* VIA PIX\n` +
          `🖼️ *ESTOU ENVIANDO O COMPROVANTE ABAIXO:*`
        );
        window.open(`https://wa.me/${restaurant.paymentConfig.whatsappPix}?text=${text}`, '_blank');
      }
    } catch (e) {
      console.error("Erro ao salvar pedido no banco:", e);
      alert("Erro ao processar pedido. Tente novamente.");
    }
  };

  const sendAppNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status });
      const order = orders.find(o => o.id === orderId);
      if (order) {
        let msgBody = '';
        switch(status) {
          case 'preparing': msgBody = `Pedido de ${order.restaurantName} em preparo!`; break;
          case 'delivering': msgBody = `O entregador saiu com seu pedido de ${order.restaurantName}!`; break;
          case 'completed': msgBody = `Bom apetite! Pedido de ${order.restaurantName} entregue.`; break;
        }
        if (msgBody) sendAppNotification('Delivery Pira', msgBody);
      }
    } catch (e) {
      console.error("Erro ao atualizar status:", e);
    }
  };

  const handleSellerRegister = async (newRes: Restaurant) => {
    try {
      await setDoc(doc(db, "restaurants", newRes.id), { ...newRes, isOpen: true });
      setActiveRestaurantId(newRes.id);
      setRole('seller');
      setHasEntered(true);
      setShowSellerRegister(false);
      setCurrentView('seller-dashboard');
    } catch (e) {
      console.error("Erro ao registrar parceiro:", e);
      alert("Erro ao criar cadastro. Verifique sua conexão.");
    }
  };

  const handleLogout = () => {
    setRole(null);
    setHasEntered(false);
    setActiveRestaurantId(null);
    setSelectedRestaurantId(null);
    setCurrentView('home');
    localStorage.clear();
  };

  const handleEnterDevRoot = () => {
    const pass = window.prompt('Acesso Root - Digite a senha:');
    if (pass === '0382690') setCurrentView('dev-admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
        <div className="w-16 h-16 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-sm font-black text-red-600 uppercase tracking-widest animate-pulse">Carregando Pira Certo...</p>
      </div>
    );
  }

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
        <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} deferredPrompt={deferredPrompt} />
        {showLoginModal && <LoginModal restaurants={restaurants} customerInfo={customerInfo} onLoginSuccess={handleLoginSuccess} onCancel={() => setShowLoginModal(false)} />}
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
          <DevAdminView restaurants={restaurants} setRestaurants={() => {}} onBack={() => setCurrentView('home')} />
        )}

        {currentView === 'register' && !role && (
          <RegisterView 
            onSelectCustomer={() => setShowCustomerRegister(true)}
            onSelectSeller={() => setShowSellerRegister(true)}
            onSelectLogin={() => setShowLoginModal(true)}
            onBack={() => setHasEntered(false)}
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
                    <span className="text-sm font-bold text-gray-800 truncate max-w-[200px]">{customerInfo.address}</span>
                  </div>
                </div>
                <button onClick={() => setShowCustomerRegister(true)} className="text-[10px] bg-gray-50 text-gray-400 px-3 py-1 rounded-lg font-black uppercase">Alterar</button>
              </div>
            )}

            {currentView === 'home' && <HomeView restaurants={restaurants} onSelectRestaurant={handleSelectRestaurant} favorites={favorites} onToggleFavorite={handleToggleFavorite} onBackToLanding={!role ? () => setHasEntered(false) : undefined} />}
            {currentView === 'search' && <SearchView restaurants={restaurants} onSelectRestaurant={handleSelectRestaurant} onBack={() => setCurrentView('home')} />}
            {currentView === 'restaurant' && currentRestaurant && <RestaurantView restaurant={currentRestaurant} onBack={() => setCurrentView('home')} onAddToCart={addToCart} isFavorite={favorites.includes(currentRestaurant.id)} onToggleFavorite={handleToggleFavorite} onAddReview={handleAddReview} userName={customerInfo?.name} />}
            {currentView === 'orders' && (
              <div className="space-y-6 animate-fadeIn">
                <h1 className="text-3xl font-black text-gray-800 italic tracking-tighter">Meus Pedidos</h1>
                {orders.length === 0 ? (
                  <div className="bg-white p-12 rounded-[2.5rem] text-center border-2 border-dashed border-gray-100">
                     <p className="font-bold text-gray-400">Nenhum pedido realizado.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg text-gray-900">{order.restaurantName}</h3>
                          <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${order.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-500 animate-pulse'}`}>
                             {order.status === 'completed' ? 'Concluído' : 'Em curso'}
                          </div>
                        </div>
                        <OrderTracking status={order.status} />
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-xs text-gray-400">{order.date}</span>
                          <span className="text-gray-900 font-black">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {role === 'seller' && activeRestaurantId && (
          <>
            {currentView === 'seller-dashboard' && (
              <SellerDashboard 
                orders={orders}
                restaurants={restaurants.filter(r => r.id === activeRestaurantId)} 
                updateOrderStatus={updateOrderStatus}
                onManageLojas={() => setCurrentView('admin')}
              />
            )}
            {currentView === 'admin' && (
              <AdminView 
                restaurants={restaurants} 
                setRestaurants={() => {}} // Agora o Firebase cuida disso
                activeRestaurantId={activeRestaurantId}
                onBack={() => setCurrentView('seller-dashboard')} 
              />
            )}
          </>
        )}
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onRemove={(id) => setCart(c => c.filter(x => x.id !== id))} onCheckout={handleCheckout} restaurants={restaurants} isRegistered={!!customerInfo} />
      {showLoginModal && <LoginModal restaurants={restaurants} customerInfo={customerInfo} onLoginSuccess={handleLoginSuccess} onCancel={() => setShowLoginModal(false)} />}
      {showSellerRegister && <SellerRegistration onRegister={handleSellerRegister} onCancel={() => setShowSellerRegister(false)} />}
      {showCustomerRegister && <CustomerRegistration initialData={customerInfo} onSave={handleSaveCustomerInfo} onCancel={() => setShowCustomerRegister(false)} />}
      <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} deferredPrompt={deferredPrompt} />
    </Layout>
  );
};

export default App;
