import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.scss";
import './index.css'
import App from './App.jsx'
import { PostsProvider } from './context/PostsContext'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WagmiProvider, createConfig, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { base, baseSepolia } from 'wagmi/chains'
import { Web3Modal } from '@web3modal/react'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { setApiKey } from "@zoralabs/coins-sdk";
import { ThirdwebProvider } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { AutoConnect } from "thirdweb/react";
import { clientThirdweb } from '../client';


const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http('https://1rpc.io/base')
  }
})

setApiKey(import.meta.env.VITE_ZORO_KEY);

// 2. Create a QueryClient
const queryClient = new QueryClient()

createWeb3Modal({ wagmiConfig, projectId: '4940035ce4b4813061af223f7b3c77f4', chains: [base] })
 
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
    <QueryClientProvider client={queryClient}>
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
      <Web3Modal projectId="4940035ce4b4813061af223f7b3c77f4" config={wagmiConfig} />
      </QueryClientProvider>
    {/* </WagmiProvider> */}
    </ThirdwebProvider>
  </StrictMode>,
)
