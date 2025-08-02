import React, { createContext, useState } from 'react';
import NFT1 from "/NFT1.png";
import NFT2 from "../assets/NFTs/NFT2.png";
import NFT3 from "../assets/NFTs/NFT3.png";
import Loved from "../assets/icons/loved.svg";
import VideoClip from "/video_clip.mp4";

// Create the context
export const PostsContext = createContext();

// Create the provider component
export const PostsProvider = ({ children }) => {
  const [forYouPosts, setForYouPosts] = useState([
    {
      id: 1,
      nftImg: NFT1,
      theme:1,
      title: "Taste of Ice",
      amount: "12.5",
      creator: "0x1b6e16403b06a51C42Ba339E356a64fE67348e92",
      category: "Art",
      type: "artworks",
      description: "An artwork of the 21st century",
      date: "June 10, 2025",
      content: NFT1
    },
    {
      id: 2,
      nftImg: NFT2,
      theme: 2,
      title: "Deploying contracts on Etherlink",
      amount: "12.5",
      creator: "0x9d4eF81F5225107049ba08F69F598D97B31ea644",
      category: "Web3",
      type: "words",
      date: "June 18, 2025",
      readTime: "3 mins",
      content: "A Journey Through Nature and Words..."
    }, 
    {
      id: 3,
      nftImg: NFT1,
      theme: 3,
      title: "Step Boss",
      amount: "12.5",
      creator: "0x9d4eF81F5225107049ba08F69F598D97B31ea644",
      category: "Web3",
      type: "video",
      date: "June 18, 2025",
      description: "A couple of boys playing with some dance steps",
      content: VideoClip
    }]
    );
  const [themes, setThemes] = useState([
    {
      id: 1,
      nftImg: NFT1,
      theme:"Modern Culinary Art",
      description: "Upload work of arts",
      amount: "12.5",
      creator: "0x1b6e16403b06a51C42Ba339E356a64fE67348e92",
      category: "Art",
      type: "artworks",
      collaborators:3,
      date: "June 10, 2025"
    },
    {
      id: 2,
      nftImg: NFT2,
      theme: "Etherlink SDK Practice",
      description: "Deploying contracts on Etherlink",
      amount: "12.5",
      creator: "0x9d4eF81F5225107049ba08F69F598D97B31ea644",
      category: "Web3",
      type: "words",
      collaborators: 2,
      date: "June 18, 2025"
    }, 
    {
      id: 3,
      nftImg: NFT1,
      theme: "DanceHall Steps Faceoff",
      title: "Step Boss",
      amount: "12.5",
      creator: "0x9d4eF81F5225107049ba08F69F598D97B31ea644",
      category: "Web3",
      type: "video",
      collaborators: 1,
      date: "June 18, 2025",
    }]
    );
  const [collectionPosts, setCollectionPosts] = useState([]);
  const [coinDetails, setCoinDetails] = useState([]);
  const [allCoinAddresses, setAllCoinAddresses] = useState([]);
  const [allUsers, setAllUsers] = useState([]);


  const addCoinAddress = (newCoinAddress) => {
    setAllCoinAddresses((prevCoinAddresses) => [...prevCoinAddresses, newCoinAddress]);
  };

  const setCoinAddresses = (coinAddresses) => {
    setAllCoinAddresses(coinAddresses);
  };

  const setCoinsDetails = (coinsDetails) => {
    setCoinDetails(coinsDetails);
  };

  const setPlatformUsers = (allUsers) => {
    setAllUsers(allUsers);
  };

  const addCoinDetails = (newCoinDetails) => {
    setCoinDetails((prevCoinDetails) => [...prevCoinDetails, newCoinDetails]);
  };

  return (
    <PostsContext.Provider value={{ forYouPosts, themes, collectionPosts, addCoinAddress, setCoinAddresses, allCoinAddresses, setCoinsDetails, addCoinDetails, coinDetails, setPlatformUsers, allUsers }}>
      {children}
    </PostsContext.Provider>
  );
}; 