import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.scss";
import './index.css'
import App from './App.jsx'
import { PostsProvider } from './context/PostsContext'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThirdwebProvider } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { AutoConnect } from "thirdweb/react";
import { clientThirdweb } from '../client';

 
// wallets used in your app
const wallets = [
  inAppWallet(),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
];

createRoot(document.getElementById('app')).render(
  <StrictMode>
    <ThirdwebProvider>
    <AutoConnect
      client={clientThirdweb}
      timeout={10000}
      wallets={wallets}
    />
    {/* <WagmiProvider config={wagmiConfig}> */}
      <PostsProvider>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </PostsProvider>
    {/* </WagmiProvider> */}
    </ThirdwebProvider>
  </StrictMode>,
)
