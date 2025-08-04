import React, { useContext, useEffect, useState } from "react";
import NftCard from "./NftCard";
import { PlusIcon } from "lucide-react";
import { PostsContext } from "../context/PostsContext";
import { useNavigate } from "react-router-dom";
import Loved from "../assets/icons/loved.svg";
import Heart from "../assets/icons/heart.svg";
import { useActiveAccount } from "thirdweb/react";

const MyCollection = ({ classType }) => {
  const [loading, setLoading] = useState(true);
  const { forYouPosts } = useContext(PostsContext);
  const activeAccount = useActiveAccount();
  const navigate = useNavigate();
  const [userContents, setUserContents] = useState(forYouPosts.filter((it) => it.creator === activeAccount?.address));


  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [])
  

  if (!activeAccount?.address) {
    return (
      <div>
      <div className="w-full bg-[#f6f2ff]">
        <div className="w-full bg-white text-center h-full my-auto min-h-screen mt-4">
          <span className='text-black block text-2xl pt-10'>Wallet Not Connected</span>
        </div>
      </div>
    </div>
    )}

  if (activeAccount?.address.toLowerCase() !== "0x097753B3EF40ca0676B8d95f59303AcC5f3f42cF".toLowerCase() && forYouPosts.filter((it) => it.creator === activeAccount?.address).length === 0) {
    return (
      <div>
      <div className="w-full bg-[#f6f2ff]">
        <div className="w-full bg-white text-center h-full my-auto min-h-screen mt-4">
          <span className='text-black block text-2xl pt-10'>No Collaboration Found</span>
        </div>
      </div>
    </div>
    )}
  


  return (
    <div className="flex">
      <div className="h-screen overflow-y-scroll space-y-10 w-full px-3 mt-4 pb-5 bg-white rounded-md">
        
        <section className="p-3">
            <div className="w-full text-sm flex justify-between">
              <span className="font-bold text-gray-900">My Uploaded Theme Content (Arts, Posts, Videos)</span>
            </div>

          {(loading && forYouPosts.length === 0) && (
            // Show skeleton loader while loading
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-40"></div>
                <div className="mt-2 bg-gray-200 h-4 w-3/4 rounded"></div>
                <div className="mt-2 bg-gray-200 h-4 w-1/2 rounded"></div>
              </div>
              ))}
            </div>
            )}

            {(forYouPosts.length > 0 && !loading) && (
            // Show filtered coin details
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
              {(activeAccount?.address.toLowerCase() !== "0x097753B3EF40ca0676B8d95f59303AcC5f3f42cF".toLowerCase() ? forYouPosts.filter((it) => it.creator === activeAccount?.address) : forYouPosts).map((post, index) => (
                <NftCard
                key={index}
                id={post?.id}
                nftImg={post?.nftImg}
                category={post?.category}
                title={post?.title}
                theme={post?.theme}
                content={post?.content}
                amount={post?.amount}
                loved={Loved}
                notLoved={Heart}
                type={post?.type}
              />
              ))}
            </div>
            )}

            {(forYouPosts.length === 0 && !loading) && (
            // Show "No Posts yet" if there are no matching posts
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">No Posts yet</p>
            </div>
          )}
        </section>

        
      </div>
    </div>
  );
};

export default MyCollection;
