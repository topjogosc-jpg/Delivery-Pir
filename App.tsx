
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
import { db, isDbInitialized, collection, doc, setDoc, updateDoc, onSnapshot, query, where, orderBy, addDoc } from './services/firebase.ts';

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
  const [dbAvailable, setDbAvailable] = useState(isDbInitialized);

  // 1. Ouvinte Global de Restaurantes
  useEffect(() => {
    if (!isDbInitialized || !db) {
      setRestaurants(MOCK_RESTAURANTS);
      setIsLoading(false);
      setDbAvailable(false);
      return;
    }

    try {
      const unsub = onSnapshot(collection(db, "restaurants"), (snapshot) => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Restaurant));
        setRestaurants(list.length > 0 ? list : MOCK_RESTAURANTS);
        setIsLoading(false);
        setDbAvailable(true);
      }, (err) => {
        console.warn("Firestore não acessível ou sem permissão. Usando dados locais.");
        setRestaurants(MOCK_RESTAURANTS);
        setIsLoading(false);
        setDbAvailable(false);
      });
      return () => unsub();
    } catch (e) {
      console.error("Erro ao inicializar listener de restaurantes:", e);
      setRestaurants(MOCK_RESTAURANTS);
      setIsLoading(false);
      setDbAvailable(false);
    }
  }, []);

  // 2. Ouvinte de Pedidos em Tempo Real
  useEffect(() => {
    if (!role || !dbAvailable || !db) return;
    let q;
    try {
      if (role === 'seller' && activeRestaurantId) {
        q = query(collection(db, "orders"), where("restaurantId", "==", activeRestaurantId), orderBy("timestamp", "desc"));
      } else if (role === 'customer' && customerInfo) {
        q = query(collection(db, "orders"), where("customerInfo.email", "==", customerInfo.email.toLowerCase()), orderBy("timestamp", "desc"));
      } else return;

      const unsub = onSnapshot(q, (snap) => {
        setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      }, (err) => {
        console.warn("Erro no listener de pedidos (pode faltar índice ou chaves):", err);
      });
      return () => unsub();
    } catch (e) {
      console.error("Falha ao criar query de pedidos:", e);
    }
  }, [role, activeRestaurantId, customerInfo, dbAvailable]);

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
    try {
      if (dbAvailable && db) {
        const docId = info.email.toLowerCase().replace(/[^a-z0-9]/g, '_');
        await setDoc(doc(db, "customers", docId), info);
      }
      setCustomerInfo(info);
      setRole('customer');
      setHasEntered(true);
      setShowCustomerRegister(false);
      setCurrentView('home');
    } catch (e) {
      alert("Salvando perfil apenas localmente devido a falha no banco.");
      setCustomerInfo(info);
      setRole('customer');
      setHasEntered(true);
      setShowCustomerRegister(false);
    }
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
      date: now.toLocaleDateString('pt-BR'),
      timestamp: now.getTime(),
      restaurantName: firstItem.restaurantName,
      total: cart.reduce((acc, i) => acc + (i.price * i.quantity), 0) + deliveryFee,
      items: [...cart],
      status: 'pending' as const,
      paymentMethod: method,
      paymentDetails: details || "",
      customerInfo: customerInfo
    };

    try {
      if (dbAvailable && db) {
        await addDoc(collection(db, "orders"), newOrder);
      } else {
        throw new Error("DB Offline");
      }
      setCart([]);
      setIsCartOpen(false);
      setCurrentView('orders');
    } catch (e) {
      console.error("Erro ao salvar pedido:", e);
      alert("Não foi possível enviar o pedido ao banco. Certifique-se de que o Firebase está configurado corretamente.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      if (dbAvailable && db) {
        await updateDoc(doc(db, "orders", orderId), { status });
      }
    } catch (e) {
      console.error("Erro ao atualizar pedido:", e);
    }
  };

  const handleSellerRegister = async (newRes: Restaurant) => {
    try {
      if (dbAvailable && db) {
        await setDoc(doc(db, "restaurants", newRes.id), { ...newRes, isOpen: true });
      }
      setActiveRestaurantId(newRes.id);
      setRole('seller');
      setHasEntered(true);
      setShowSellerRegister(false);
      setCurrentView('seller-dashboard');
    } catch (e) {
      alert("Erro ao registrar no banco. Tente novamente mais tarde.");
    }
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
        <p className="mt-4 text-[10px] font-black uppercase text-red-600 tracking-widest">Iniciando Delivery Pira...</p>
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
      {!dbAvailable && (
        <div className="bg-amber-500 text-white text-[10px] font-black text-center py-2 uppercase tracking-widest rounded-xl mb-4 animate-fadeIn">
          <i className="fa-solid fa-triangle-exclamation mr-2"></i>
          Modo Offline: Dados não serão sincronizados com o servidor
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
