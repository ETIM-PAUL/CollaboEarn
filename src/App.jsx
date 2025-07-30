import React, { useContext, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import LandingPage from './pages/landing.jsx'
import DashboardPage from './pages/Dashboard.jsx'
import Register from './pages/Register.jsx'
import Collection from './pages/collection.jsx'
import ForYou from './pages/foryou.jsx'
import MyWallet from './pages/my_wallet.jsx'
import Settings from './pages/settings.jsx'
import BlogDetails from './pages/blog_details.jsx'
import PublishPost from './pages/publish_post.jsx'
import { abi, coinContract } from "./components/utils";
import { ethers } from "ethers";
import { getCoins } from "@zoralabs/coins-sdk";
import { PostsContext } from "./context/PostsContext";
import { base, baseSepolia } from "viem/chains";
import { autoConnect } from "thirdweb/wallets";
import { clientThirdweb } from '../client';

function App() {
  const { setCoinAddresses, setCoinsDetails, setPlatformUsers } = useContext(PostsContext);

  const getAllCoins = async () => {
    try {
      // Replace with your contract address and ABI
      const contractAddress = coinContract;
  
      // Initialize provider and contract
      const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
      const contract = new ethers.Contract(contractAddress, abi, provider);
  
      // Call the getAllCoins function
      const coinAddresses = await contract.getAllCoins();
      setCoinAddresses(coinAddresses);
      
      try {
        const response = await getCoins({
          coins: coinAddresses.map((address) => ({
            chainId: base?.id,
            collectionAddress: address
          }))
        });
        setCoinsDetails(response?.data?.zora20Tokens)
      } catch (error) {
        console.log('error', error);
      }
    } catch (error) {
      console.error('Error fetching coin addresses:', error);
      throw error;
    }
  };

  const getAllUsers = async () => {
    try {
      const contractAddress = coinContract;
  
      // Initialize provider and contract
      const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
      const contract = new ethers.Contract(contractAddress, abi, provider);
  
      // Call the getAllCoins function
      const coinAddresses = await contract.getAllUsers();
      setPlatformUsers(coinAddresses);
    } catch (error) {
      console.log('error', error);
    }
  }

  const connectAutomated = async () => {
    await autoConnect({
      client:clientThirdweb,
      onConnect: (wallet) => {
        console.log("wallet", wallet);
      },
    });
  }

  
  useEffect(() => {
    getAllCoins();
    getAllUsers();
    connectAutomated();
  }, []);

  return (
    <Router>
      <div className=''>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/for-you" element={<ForYou />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/my-wallet" element={<MyWallet />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/blog_details/:id" element={<BlogDetails />} />
          <Route path="/publish_post" element={<PublishPost />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
