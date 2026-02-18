
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const setupNotifications = async () => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    // Determine the path to the service worker relative to the current location
    // to avoid origin mismatch errors in proxied environments
    const swPath = new URL('./sw.js', import.meta.url).pathname;
    
    const registration = await navigator.serviceWorker.register(swPath, {
      scope: '/',
    });
    
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Delivery Pira: Notificações Ativas');
      }
    }
  } catch (error) {
    // Log the error but don't break the app as SW is an enhancement
    console.warn('Service Worker registration skipped or failed:', error);
  }
};

setupNotifications();

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
