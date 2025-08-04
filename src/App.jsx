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
import { abi, contractAddress } from "./components/utils";
import { BigNumber, ethers } from "ethers";
import { PostsContext } from "./context/PostsContext";
import { autoConnect } from "thirdweb/wallets";
import { clientThirdweb } from '../client';
import Themes from './pages/themes.jsx'
import CreateTheme from './pages/create_theme.jsx'

function App() {
  const { setAllThemes, setAllContributions } = useContext(PostsContext);

  async function getThemeInfo(link) {
    const url = link;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  const getAllThemes = async () => {
    try {
      // Initialize provider and contract
      const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
      const contract = new ethers.Contract(contractAddress, abi, provider);

      // Call the getAllThemes function
      const allThemes = await contract.getAllThemes();

      // Map each theme to a promise that resolves to the formatted object
      const formattedThemes = await Promise.all(
        allThemes.map(async (element) => {
          const res = await getThemeInfo(element?.ipfsUrl);
          return {
            id: BigNumber.from(element?.id._hex).toString(),
            nftImg: res?.image,
            theme: res?.theme,
            description: res?.description,
            amount: BigNumber.from(element?.tips._hex).toString(),
            creator: element?.creator,
            category: res?.category,
            type: element?.contentType,
            collaborators: BigNumber.from(element?.collaborators._hex).toString(),
            maxCollaborators: BigNumber.from(element?.maxCollaborators._hex).toString(),
            date: BigNumber.from(element?.dateCreated._hex).toString(),
          };
        })
      );

      setAllThemes(formattedThemes);
      return formattedThemes;

    } catch (error) {
      console.error('Error fetching coin addresses:', error);
      throw error;
    }
  };

  const getAllContributions = async (themes) => {
    try {
      // Initialize provider and contract
      const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
      const contract = new ethers.Contract(contractAddress, abi, provider);
  
      // Call the getAllCoins function
      const allContributions = await contract.getAllContributions();

      // Map each theme to a promise that resolves to the formatted object
      const formattedContents = await Promise.all(
        allContributions.map(async (element) => {
          const res = await getThemeInfo(element?.ipfsLink);
          return {
            id: BigNumber.from(element?.id._hex).toNumber(),
            nftImg: res?.image,
            theme:  BigNumber.from(element?.themeId._hex).toString(),
            type: themes.find((item) => item?.id === BigNumber.from(element?.themeId._hex).toString())?.type,
            title: res?.name,
            description: res?.description,
            approved: element?.approved,
            creator: element?.creator,
            content:res?.content,
            date: BigNumber.from(element?.dateCreated._hex).toString(),
          };
        })
      );


      setAllContributions(formattedContents);
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
    getAllThemes().then((res) => getAllContributions(res));
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
          <Route path="/themes" element={<Themes />} />
          <Route path="/my-wallet" element={<MyWallet />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/blog_details/:id" element={<BlogDetails />} />
          <Route path="/theme_details/:id" element={<BlogDetails />} />
          <Route path="/publish_post/:id" element={<PublishPost />} />
          <Route path="/create_theme" element={<CreateTheme />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
