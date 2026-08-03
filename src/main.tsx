import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { registrarServiceWorker } from './lib/pwa';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// PWA instalável (só em produção; ver lib/pwa.ts).
registrarServiceWorker();
