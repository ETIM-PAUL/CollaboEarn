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
  const [allUsers, setAllUsers] = useState([]);


  const setAllThemes = (themes) => {
    setThemes(themes);
  };

  const setAllContributions = (contents) => {
    setForYouPosts(contents);
  };

  const updateContributionStatus = (id, status) => {
    setForYouPosts(prevPosts =>
      prevPosts.map(post =>
        Number(post.id) === Number(id)
          ? { ...post, approved: status }
          : post
      )
    );
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

  const approvedPosts = forYouPosts.filter((item) => item.approved === true);

  return (
    <PostsContext.Provider value={{ forYouPosts, approvedPosts, themes, updateContributionStatus, setAllThemes, setAllContributions, setCoinsDetails, addCoinDetails, coinDetails, setPlatformUsers, allUsers }}>
      {children}
    </PostsContext.Provider>
  );
}; 