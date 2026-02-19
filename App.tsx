
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
import RegisterView from './components/RegisterView.tsx';
import DevAdminView from './components/DevAdminView.tsx';
import DownloadModal from './components/DownloadModal.tsx';
import { View, Restaurant, FoodItem, CartItem, Order, UserRole, PaymentMethod, CustomerInfo } from './services/types.ts';
import { MOCK_RESTAURANTS } from './constants.tsx';
import { supabase, isSupabaseConfigured } from './services/supabase.ts';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(() => localStorage.getItem('pira_session_role') as UserRole || null);
  const [currentView, setCurrentView] = useState<View>(() => localStorage.getItem('pira_session_view') as View || 'home');
  const [hasEntered, setHasEntered] = useState(() => !!localStorage.getItem('pira_session_role'));
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => JSON.parse(localStorage.getItem('pira_database_favorites') || '[]'));
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(() => {
    const saved = localStorage.getItem('pira_database_customer_info');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeRestaurantId, setActiveRestaurantId] = useState<string | null>(localStorage.getItem('pira_session_active_res'));
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(localStorage.getItem('pira_session_selected_res'));
  const [cart, setCart] = useState<CartItem[]>(() => JSON.parse(localStorage.getItem('pira_current_cart') || '[]'));

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSellerRegister, setShowSellerRegister] = useState(false);
  const [showCustomerRegister, setShowCustomerRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // 1. Carregar Restaurantes (Supabase)
  useEffect(() => {
    const loadRestaurants = async () => {
      if (!isSupabaseConfigured || !supabase) {
        setRestaurants(MOCK_RESTAURANTS);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.from('restaurants').select('*');
      if (data) setRestaurants(data.length > 0 ? data : MOCK_RESTAURANTS);
      else setRestaurants(MOCK_RESTAURANTS);
      
      setIsLoading(false);

      // Inscrição Realtime para atualizações de restaurantes
      const subscription = supabase
        .channel('restaurants_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurants' }, () => {
          loadRestaurants(); // Recarregar em caso de mudança
        })
        .subscribe();

      return () => { supabase.removeChannel(subscription); };
    };

    loadRestaurants();
  }, []);

  // 2. Ouvinte de Pedidos Realtime (Supabase)
  useEffect(() => {
    if (!role || !isSupabaseConfigured || !supabase) return;

    const fetchOrders = async () => {
      let query = supabase.from('orders').select('*').order('timestamp', { ascending: false });
      
      if (role === 'seller' && activeRestaurantId) {
        query = query.eq('restaurantId', activeRestaurantId);
      } else if (role === 'customer' && customerInfo) {
        query = query.eq('customerInfo->>email', customerInfo.email.toLowerCase());
      } else return;

      const { data } = await query;
      if (data) setOrders(data as Order[]);
    };

    fetchOrders();

    const orderSub = supabase
      .channel('orders_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(orderSub); };
  }, [role, activeRestaurantId, customerInfo]);

  // Persistência Local
  useEffect(() => {
    localStorage.setItem('pira_database_favorites', JSON.stringify(favorites));
    localStorage.setItem('pira_current_cart', JSON.stringify(cart));
    localStorage.setItem('pira_session_view', currentView);
    if (role) localStorage.setItem('pira_session_role', role);
    if (customerInfo) localStorage.setItem('pira_database_customer_info', JSON.stringify(customerInfo));
    if (activeRestaurantId) localStorage.setItem('pira_session_active_res', activeRestaurantId);
  }, [favorites, cart, role, currentView, customerInfo, activeRestaurantId]);

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleSaveCustomerInfo = async (info: CustomerInfo) => {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('customers').upsert({
        email: info.email.toLowerCase(),
        name: info.name,
        phone: info.phone,
        address: info.address,
        pin: info.pin
      });
    }
    setCustomerInfo(info);
    setRole('customer');
    setHasEntered(true);
    setShowCustomerRegister(false);
    setCurrentView('home');
  };

  const handleCheckout = async (method: PaymentMethod, details?: string, deliveryFee: number = 0) => {
    if (!customerInfo || details === 'force_registration') {
      setIsCartOpen(false);
      setShowCustomerRegister(true);
      return;
    }
    if (cart.length === 0 || isSubmittingOrder) return;

    setIsSubmittingOrder(true);
    const firstItem = cart[0];
    const now = new Date();
    
    const newOrder = {
      restaurantId: firstItem.restaurantId,
      restaurantName: firstItem.restaurantName,
      date: now.toLocaleDateString('pt-BR'),
      timestamp: now.getTime(),
      total: cart.reduce((acc, i) => acc + (i.price * i.quantity), 0) + deliveryFee,
      items: cart,
      status: 'pending',
      paymentMethod: method,
      paymentDetails: details || "",
      customerInfo: customerInfo
    };

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('orders').insert(newOrder);
        if (error) throw error;
      }
      setCart([]);
      setIsCartOpen(false);
      setCurrentView('orders');
    } catch (e) {
      console.error("Erro ao salvar pedido:", e);
      alert("Erro ao enviar pedido. Verifique sua conexão.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('orders').update({ status }).eq('id', orderId);
    }
  };

  const handleSellerRegister = async (newRes: Restaurant) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('restaurants').insert(newRes);
      if (error) {
        alert("Erro no cadastro: " + error.message);
        return;
      }
    }
    setActiveRestaurantId(newRes.id);
    setRole('seller');
    setHasEntered(true);
    setShowSellerRegister(false);
    setCurrentView('seller-dashboard');
  };

  const handleLoginSuccess = (loginRole: 'customer' | 'seller', data: Restaurant | CustomerInfo) => {
    if (loginRole === 'seller') {
      setActiveRestaurantId((data as Restaurant).id);
      setRole('seller');
      setCurrentView('seller-dashboard');
    } else {
      setCustomerInfo(data as CustomerInfo);
      setRole('customer');
      setCurrentView('home');
    }
    setHasEntered(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-[10px] font-black uppercase text-red-600 tracking-widest">Conectando ao Delivery Pira...</p>
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
          onEnterDevRoot={() => {
            const pass = prompt('Senha Root:');
            if (pass === '0382690') setCurrentView('dev-admin');
          }}
        />
        {showLoginModal && <LoginModal onLoginSuccess={handleLoginSuccess} onCancel={() => setShowLoginModal(false)} />}
      </>
    );
  }

  const currentRestaurant = restaurants.find(r => r.id === selectedRestaurantId);

  return (
    <Layout 
      activeView={currentView} 
      setView={setCurrentView} 
      cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
      role={role}
      onLogout={handleLogout}
      onLoginClick={() => setShowLoginModal(true)}
    >
      {!isSupabaseConfigured && (
        <div className="bg-amber-500 text-white text-[10px] font-black text-center py-2 uppercase tracking-widest rounded-xl mb-4 animate-fadeIn">
          <i className="fa-solid fa-triangle-exclamation mr-2"></i>
          Modo Demo: Configure o Supabase no README para salvar dados
        </div>
      )}

      <div className="pb-10 pt-4">
        {currentView === 'dev-admin' && <DevAdminView restaurants={restaurants} setRestaurants={() => {}} onBack={() => setCurrentView('home')} />}
        {currentView === 'register' && (
          <RegisterView 
            onSelectCustomer={() => setShowCustomerRegister(true)}
            onSelectSeller={() => setShowSellerRegister(true)}
            onSelectLogin={() => setShowLoginModal(true)}
            onBack={() => setHasEntered(false)}
          />
        )}
        {(role === 'customer' || !role) && currentView !== 'register' && currentView !== 'dev-admin' && (
          <>
            {currentView === 'home' && <HomeView restaurants={restaurants} onSelectRestaurant={(r) => { setSelectedRestaurantId(r.id); setCurrentView('restaurant'); }} favorites={favorites} onToggleFavorite={handleToggleFavorite} onBackToLanding={!role ? () => setHasEntered(false) : undefined} />}
            {currentView === 'search' && <SearchView restaurants={restaurants} onSelectRestaurant={(r) => { setSelectedRestaurantId(r.id); setCurrentView('restaurant'); }} onBack={() => setCurrentView('home')} />}
            {currentView === 'restaurant' && currentRestaurant && <RestaurantView restaurant={currentRestaurant} onBack={() => setCurrentView('home')} onAddToCart={(item) => {
              if (cart.length > 0 && cart[0].restaurantId !== currentRestaurant.id) {
                if (!confirm("Limpar sacola anterior?")) return;
                setCart([]);
              }
              setCart(prev => {
                const ex = prev.find(i => i.id === item.id);
                if (ex) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
                return [...prev, { ...item, quantity: 1, restaurantId: currentRestaurant.id, restaurantName: currentRestaurant.name }];
              });
              setIsCartOpen(true);
            }} isFavorite={favorites.includes(currentRestaurant.id)} onToggleFavorite={handleToggleFavorite} onAddReview={() => {}} />}
            {currentView === 'orders' && (
              <div className="space-y-6 animate-fadeIn">
                <h1 className="text-3xl font-black text-gray-800 italic tracking-tighter">Meus Pedidos</h1>
                {orders.length === 0 ? <p className="text-gray-400">Nenhum pedido realizado.</p> : orders.map(o => (
                  <div key={o.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between font-bold"><span>{o.restaurantName}</span><span className="text-red-500 uppercase text-[10px]">{o.status}</span></div>
                    <OrderTracking status={o.status} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {role === 'seller' && activeRestaurantId && (
          <>
            {currentView === 'seller-dashboard' && <SellerDashboard orders={orders} restaurants={restaurants.filter(r => r.id === activeRestaurantId)} updateOrderStatus={updateOrderStatus} onManageLojas={() => setCurrentView('admin')} />}
            {currentView === 'admin' && <AdminView restaurants={restaurants} activeRestaurantId={activeRestaurantId} onBack={() => setCurrentView('seller-dashboard')} />}
          </>
        )}
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onRemove={(id) => setCart(c => c.filter(x => x.id !== id))} onCheckout={handleCheckout} restaurants={restaurants} isRegistered={!!customerInfo} />
      {showSellerRegister && <SellerRegistration onRegister={handleSellerRegister} onCancel={() => setShowSellerRegister(false)} />}
      {showCustomerRegister && <CustomerRegistration initialData={customerInfo} onSave={handleSaveCustomerInfo} onCancel={() => setShowCustomerRegister(false)} />}
    </Layout>
  );
};

export default App;
