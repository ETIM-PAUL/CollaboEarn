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
  const [forYouPosts, setForYouPosts] = useState([]
    );
  const [themes, setThemes] = useState([]);
  const [coinDetails, setCoinDetails] = useState([]);
  const [allCoinAddresses, setAllCoinAddresses] = useState([]);
  const [allUsers, setAllUsers] = useState([]);


  const addCoinAddress = (newCoinAddress) => {
    setAllCoinAddresses((prevCoinAddresses) => [...prevCoinAddresses, newCoinAddress]);
  };

  const setAllThemes = (themes) => {
    setThemes(themes);
  };

  const setAllContributions = (contents) => {
    setForYouPosts(contents);
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
    <PostsContext.Provider value={{ forYouPosts, themes, addCoinAddress, setAllThemes, setAllContributions, allCoinAddresses, setCoinsDetails, addCoinDetails, coinDetails, setPlatformUsers, allUsers }}>
      {children}
    </PostsContext.Provider>
  );
}; 