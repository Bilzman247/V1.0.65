import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Register PWA service worker safely without broken external script tags
if ('serviceWorker' in navigator && typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
      // Graceful fallback for environments where service workers are restricted
    });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
