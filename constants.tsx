
import { Restaurant } from './services/types.ts';

export const COLORS = {
  primary: '#EA1D2C', // iFood Red
  secondary: '#FFC107', // Gold for ratings
  background: '#F7F7F7',
};

// Dados que aparecem caso o banco de dados ainda não esteja configurado
export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'demo-1',
    name: 'Pira Burguer (Demo)',
    category: 'Lanches',
    rating: 4.8,
    distance: '1.2 km',
    deliveryTime: '30-45 min',
    deliveryFee: 0,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80',
    address: 'Av. Central, Pirapemas - MA',
    isOpen: true,
    menu: [
      {
        id: 'p1',
        name: 'X-Pira Especial',
        description: 'Pão artesanal, 2 carnes 180g, muito queijo e molho secreto.',
        price: 28.90,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
        category: 'Destaques',
        available: true
      }
    ],
    paymentConfig: {
      acceptsCard: true,
      acceptsCash: true,
      acceptsPix: false,
      pixKey: '',
      whatsappPix: ''
    }
  }
];
