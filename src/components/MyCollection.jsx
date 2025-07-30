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

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [])
  


  return (
    <div className="flex">
      <div className="h-screen overflow-y-scroll space-y-10 w-full px-3 mt-4 pb-5 bg-white rounded-md">
        
        <section className="p-3">
            <div className="w-full text-sm flex justify-between">
              <span className="font-bold text-gray-900">My Uploaded Theme Content (Arts, Posts, Videos)</span>
            </div>

            <div onClick={() => navigate("/publish_post")} className="w-full flex justify-end">
              <button className="w-fit flex items-center gap-2 cursor-pointer text-center bg-[#9e74eb] hover:opacity-90 text-white px-6 py-3 rounded-xl transition duration-300 shadow-md">
              <span className="text-sm">Publish</span>
              <PlusIcon className="w-5 h-5" />
              </button>
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
              {forYouPosts.map((post, index) => (
                <NftCard
                key={index}
                nftImg={post?.nftImg}
                category={post?.category}
                title={post?.title}
                theme={post?.theme}
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
