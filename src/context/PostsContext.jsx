import React, { createContext, useState } from 'react';
import NFT1 from "../assets/NFTs/NFT1.png";
import NFT2 from "../assets/NFTs/NFT2.png";
import NFT3 from "../assets/NFTs/NFT3.png";
import Loved from "../assets/icons/loved.svg";
import Heart from "../assets/icons/heart.svg";

// Create the context
export const PostsContext = createContext();

// Create the provider component
export const PostsProvider = ({ children }) => {
  const [forYouPosts, setForYouPosts] = useState([
    {
      id: 1,
      nftImg: NFT1,
      nftName: "ZoroChain SDK Practice",
      amount: "12.5",
      username: "@undefined",
      category: "Art",
      forSale: true,
      loved: Loved,
      notLoved: Heart,
      type: "forYou",
      date: "June 18, 2025",
      content: "A Journey Through Nature and Words..."
    },
    {
      id: 2,
      nftImg: NFT2,
      nftName: "ZoroChain SDK Practice",
      amount: "12.5",
      username: "@yur3i",
      category: "Web3",
      forSale: true,
      loved: Loved,
      notLoved: Heart,
      type: "forYou",
      date: "June 18, 2025",
      content: "A Journey Through Nature and Words..."
    }, 
    {
      id: 3,
      nftImg: NFT1,
      nftName: "ZoroChain SDK Practice",
      amount: "12.5",
      username: "@yur3i",
      category: "Web3",
      forSale: false,
      loved: Loved,
      notLoved: Heart,
      type: "forYou",
      date: "June 18, 2025",
      content: "A Journey Through Nature and Words..."
    }, 
    {
      id: 4,
      nftImg: NFT2,
      nftName: "Time is money",
      amount: "7.0",
      username: "@undefined",
      category: "Art",
      forSale: false,
      loved: Loved,
      notLoved: Heart,
      type: "forYou",
      date: "June 18, 2025",
      content: "A Journey Through Nature and Words..."
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
    <PostsContext.Provider value={{ forYouPosts, collectionPosts, addCoinAddress, setCoinAddresses, allCoinAddresses, setCoinsDetails, addCoinDetails, coinDetails, setPlatformUsers, allUsers }}>
      {children}
    </PostsContext.Provider>
  );
}; 