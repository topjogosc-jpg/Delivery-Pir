
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * Função para configurar notificações push e Service Worker
 */
const setupNotifications = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker não suportado neste navegador.');
    return;
  }

  try {
    // Registra o Service Worker
    const registration = await navigator.serviceWorker.register('./sw.js', {
      scope: '/',
    });
    console.log('Service Worker registrado com sucesso:', registration);

    // Solicita permissão para notificações
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Permissão de notificação concedida!');
      } else {
        console.warn('Permissão de notificação negada pelo usuário.');
      }
    }
  } catch (error) {
    console.error('Erro ao configurar Service Worker/Notificações:', error);
  }
};

// Inicia a configuração
setupNotifications();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Não foi possível encontrar o elemento root para montar o app");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
