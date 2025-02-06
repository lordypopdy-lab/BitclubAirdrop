import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { TonConnectUIProvider } from '@tonconnect/ui-react';

createRoot(document.getElementById('root')).render(
  <TonConnectUIProvider manifestUrl="https://bitclub-airdrop.vercel.app/tonconnect-manifest.json">
  <StrictMode>
    <App />
  </StrictMode>
   </TonConnectUIProvider>
)
