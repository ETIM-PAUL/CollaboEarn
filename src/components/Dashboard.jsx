import React, { useState, useEffect, useContext } from "react";
import Profile from "../assets/icons/profile.svg";
import SidePanel from "./SidePanel";
import NftCard from "./NftCard";
import Loved from "../assets/icons/loved.svg";
import Heart from "../assets/icons/heart.svg";
import { PostsContext } from "../context/PostsContext";
import { groupCoinsByCreator, groupedData } from "./utils";

const CreatorFlex = ({ ...props }) => {
  return (
    <div className="mr-4 flex items-center justify-between">
      <div className="flex gap-1 items-center w-full">
        <img src={Profile} alt="" className="w-10 h-10" />
        <div className="grid gap-0">
          <span className="font-medium text-gray-900">{props.username}</span>
          <span className="text-gray-700">{props.posts} {props.posts?.length > 1 ? 'posts' : 'post'} </span>
        </div>
      </div>
    </div>
  );
};

const FilterValue = ({ value, setFilter, filter }) => {
  return (
    <div
      className={`w-1/6 flex justify-center py-1 rounded-lg cursor-pointer ${
        filter === value ? "bg-[#9e74eb] text-white" : "bg-gray-200 hover:bg-[#9e74eb] text-gray-900 hover:text-white"
      }`}
      onClick={() => setFilter(value)}
    >
      <span>{value}</span>
    </div>
  );
};

const Dashboard = () => {
  const [filter, setFilter] = useState("Art");
  const [isLoading, setIsLoading] = useState(true);
  const { coinDetails, allUsers } = useContext(PostsContext);
  const [categories, setCategories] = useState({});

  const getUserName = (address) => {
    const user = allUsers.find((user) => user.userAddress.toLowerCase() === address.toLowerCase());

    return user?.username;
  }

  const getPostCount = (address) => {
    return coinDetails.filter((coin) => coin.creatorAddress.toLowerCase() === address.toLowerCase()).length;
  }

  const getCategory = async (ipfs) => {
    try {
      // Convert IPFS URL to HTTP URL
      const httpUrl = ipfs.replace('ipfs://', 'https://ipfs.io/ipfs/');
  
      // Fetch metadata from IPFS
      const metadata = await fetch(httpUrl);
      const metadataJson = await metadata.json();
      // Return the category
      return metadataJson.properties?.category;
    } catch (error) {
      console.error('Error fetching metadata from IPFS:', error);
      throw error;
    }
  };
  
  const fetchCategories = async () => {
    const categoryMap = {};
    if(coinDetails?.length > 0) {
      for (let index = 0; index < coinDetails.length; index++) {
        const element = coinDetails[index];
        try {
          const category = await getCategory(element?.tokenUri);
          categoryMap[element?.tokenUri] = category;
        } catch (error) {
          console.error(`Error fetching category for post ${element?.id}:`, error);
          categoryMap[element?.id] = 'Unknown';
        }
      }
    }
    setCategories(categoryMap);
    setTimeout(() => {
      setIsLoading(false);
    }, 6000);
  };

  useEffect(() => {
    fetchCategories();
  }, [coinDetails]);

  const SkeletonDashboard = () => (
    <div className="flex">
      <div className="h-screen overflow-y-scroll space-y-10 w-9/12 px-3 mt-4 pb-5 bg-white rounded-md">
        {/* Top Posts Skeleton */}
        <section className="p-3">
          <div className="w-full text-sm flex justify-between">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          {/* Filter Skeleton */}
          <div className="w-full flex gap-3 mt-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-1/6 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>

          {/* NFT Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-2 px-2 bg-white rounded-lg shadow">
                <div className="w-full h-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex justify-between my-2 items-center">
                  <div className="flex gap-2 items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-10 w-full bg-gray-200 rounded-lg mt-3 animate-pulse"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Creators Skeleton */}
        <section className="p-3">
          <div className="w-full text-sm flex justify-between">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="py-2 px-2 mt-3 flex w-full bg-white rounded-lg shadow">
            <div className="flex w-full flex-wrap justify-between my-2 items-center gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2 w-64">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="grid gap-1">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Table Skeleton */}
        <section className="px-3 pt-3 pb-24">
          <div className="w-full text-sm flex justify-between">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="py-2 px-2 mt-3 flex w-full bg-white rounded-lg shadow">
            <table className="w-full">
              <thead>
                {[1].map((i) => (
                  <tr key={i} className="border-b border-gray-200">
                    {[1, 2, 3, 4].map((j) => (
                      <th key={j} className="px-4 py-2">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {[1, 2, 3].map((i) => (
                  <tr key={i}>
                    {[1, 2, 3, 4].map((j) => (
                      <td key={j} className="px-4 py-2">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Side Panel Skeleton */}
      <div className="w-3/12 min-h-screen bg-white rounded-md mt-4 shadow-lg p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading && Object.keys(categories).length === 0) {
    return <SkeletonDashboard />;
  }
  
  if (!isLoading && Object.keys(categories).length === 0) {
    return <div className="flex bg-white justify-center items-center h-screen">
      <div className="text-2xl font-bold">No posts found</div>
    </div>;
  }

  return (
    <div className="flex">
      <div className="h-screen overflow-y-scroll space-y-10 w-9/12 px-3 mt-4 pb-5 bg-white rounded-md">
        
        <section className="p-3">
          <div className="w-full text-sm flex justify-between">
            <span className="font-bold text-gray-900">Posts</span>
            <span className="text-blue-500 mr-2 cursor-pointer">See more</span>
          </div>
          <div className="w-full flex gap-3 mt-3">
          {Object.keys(categories).length > 0 && Object.entries(categories).map(([key, value], index) => (
            <FilterValue key={index} value={value} setFilter={setFilter} filter={filter} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            {coinDetails?.map((coin,id) => (
            <NftCard
              key={id}
              address={coin?.address}
              nftImg={coin?.mediaContent?.previewImage?.medium}
              category={categories[coin?.tokenUri] || 'Unknown'}
              nftName={coin?.name}
              holders={coin?.uniqueHolders}
              username={getUserName(coin?.creatorAddress)}
              loved={Loved}
              notLoved={Heart}
              type="dashboard"
            />
            ))}
          </div>
        </section>

        <section className="p-3">
          <div className="w-full text-sm flex justify-between">
            <span className="font-bold text-gray-900">Top Creators</span>
            <span className="text-blue-500 mr-2 cursor-pointer">See more</span>
          </div>
          <div className="py-2 px-2 mt-3 flex w-full bg-white rounded-lg shadow">
            <div className="flex w-full flex-wrap my-2 items-center gap-2">
              {Object.keys(groupCoinsByCreator(coinDetails))?.map((coin) => (
              <CreatorFlex key={coin} username={getUserName(coin)} posts={getPostCount(coin)} />
              ))}
            </div>
          </div>
        </section>
        
        <section className="px-3 pt-3 pb-24">
          <div className="w-full text-sm flex justify-between">
            <span className="font-bold text-gray-900">Top Categories</span>
            <span className="text-blue-500 mr-2 cursor-pointer">See more</span>
          </div>
          <div className="py-2 px-2 mt-3 flex w-full bg-white rounded-lg shadow overflow-auto">
            <table className="w-full">
              <thead className="text-gray-900">
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Volume</th>
                  {/* <th className="px-4 py-2 text-left">24h</th> */}
                  <th className="px-4 py-2 text-left">Creators</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(groupedData(coinDetails, categories)).map((category, index) => (
                <tr key={index} className="py-">
                  <td className="px-4">
                    <span>{category}</span>
                  </td>
                  <td className="px-4">
                    <span>{groupedData(coinDetails, categories)[category].posts}</span>
                  </td>
                  {/* <td className="px-4 text-red-500">
                    <span>-0.20%</span>
                  </td> */}
                  <td className="px-4">
                    <span>{groupedData(coinDetails, categories)[category].creators.size}</span>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <SidePanel posts={coinDetails} />
    </div>
  );
};

export default Dashboard;
