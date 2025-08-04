import React, { useState, useEffect, useContext } from "react";
import Profile from "../assets/icons/profile.svg";
import SidePanel from "./SidePanel";
import NftCard from "./NftCard";
import Loved from "../assets/icons/loved.svg";
import Heart from "../assets/icons/heart.svg";
import { PostsContext } from "../context/PostsContext";
import { groupCoinsByCreator, groupedData } from "./utils";
import { shortenAddress } from "thirdweb/utils";
import { FaDollarSign, FaPen, FaVideo } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";
import ThemeCard from "./ThemeCard";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";


const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { forYouPosts, themes } = useContext(PostsContext);

  const totalTips = themes.reduce((sum, theme) => {
    // Convert each tip to a number (handles string, BigNumber, etc.)
    const tipValue = Number(theme.amount);
    return sum + (isNaN(tipValue) ? 0 : tipValue);
  }, 0);

  const dashboad = [
    { title: "Total Words Content", value: forYouPosts.filter((item) => item?.type === "words")?.length ?? 0, positive:"false", change:"8.3", icon:<FaPen className="text-white-400 text-2xl" />},
    { title: "Total Art Content", value: forYouPosts.filter((item) => item?.type === "artworks")?.length ?? 0, positive:"true", change:"8.3", icon:<GrGallery className="text-white-400 text-2xl" />},
    { title: "Total Video Content", value: forYouPosts.filter((item) => item?.type === "clips")?.length ?? 0, positive:"false", change:"8.3", icon:<FaVideo className="text-white-400 text-2xl" />},
    { title: "Total Tips", value: ethers.utils.formatEther(totalTips.toString()), positive:"true", change:"8.3", icon:<span className="text-white-400 text-2xl">XTZ</span>}
  ]

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

  if (isLoading && forYouPosts?.length === 0) {
    return <SkeletonDashboard />;
  }
  
  if (!isLoading && forYouPosts?.length === 0) {
    return <div className="flex bg-white justify-center items-center h-screen">
      <div className="text-2xl font-bold">No posts found</div>
    </div>;
  }

  return (
    <div className="flex">
      <div className="h-screen overflow-y-scroll space-y-10 w-9/12 px-3 mt-4 pb-5 bg-white rounded-md">
        
        <section className="p-3">
          <div className="w-full text-sm flex justify-between">
            <span className="font-bold text-gray-900">Dashboard Analytics</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            {dashboad?.map((data,index) => (
              <div key={index} className="bg-[#9e74eb] p-4 rounded-xl text-white shadow w-full flex flex-col gap-2">
              <h4 className="text-sm text-[#fff] flex items-center gap-2">{data?.title}</h4>
              <div className="flex items-center gap-2">
                {data?.icon && <span>{data?.icon}</span>}
                <p className="text-3xl font-extrabold tracking-tight">{data?.value}</p>
              </div>
              {/* <span className={`text-sm flex items-center gap-1 ${data?.positive ? 'text-green-400' : 'text-red-400'}`}
                >{data?.positive ? <span className="animate-bounce">▲</span> : <span className="animate-bounce">▼</span>} {data?.change} since last month
              </span> */}
            </div>
            ))}
          </div>
        </section>

        <section className="p-3">
          <div className="w-full text-sm flex justify-between">
            <span className="font-bold text-gray-900">Top Themes</span>
            <span onClick={()=>navigate("/themes")} className="text-blue-500 mr-2 cursor-pointer">See more</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            {themes?.map((theme,index) => (
            <ThemeCard
              key={index}
              id={theme?.id}
              nftImg={theme?.nftImg}
              category={theme?.category}
              title={theme?.title}
              theme={theme?.theme}
              amount={theme?.amount}
              loved={Loved}
              notLoved={Heart}
              type={theme?.type}
              collaborators={theme?.collaborators}
            />
            ))}
          </div>
        </section>

        {/* <section className="p-3">
          <div className="w-full text-sm flex justify-between">
            <span className="font-bold text-gray-900">Top Creators</span>
            <span className="text-blue-500 mr-2 cursor-pointer">See more</span>
          </div>
          <div className="py-2 px-2 mt-3 flex w-full bg-white rounded-lg shadow">
            <div className="flex w-full flex-col my-2 gap-2">
              {forYouPosts?.map((post) => (
              <CreatorFlex key={post.id} creator={post.creator} posts={3} />
              ))}
            </div>
          </div>
        </section> */}
        
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
                
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <SidePanel posts={forYouPosts} />
    </div>
  );
};

export default Dashboard;
