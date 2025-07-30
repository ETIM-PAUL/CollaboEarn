import React, { useContext, useState } from "react";
import NftCard from "./NftCard";
import { PostsContext } from "../context/PostsContext";
import Loved from "../assets/icons/loved.svg";
import Heart from "../assets/icons/heart.svg";


const ForYouPiece = ({ classType }) => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Art");
  const { forYouPosts } = useContext(PostsContext);


  if (loading && forYouPosts.length === 0) {
    return (
      <div className="h-screen overflow-y-scroll space-y-10 w-full px-3 mt-4 pb-5 bg-white rounded-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-40"></div>
          <div className="mt-2 bg-gray-200 h-4 w-3/4 rounded"></div>
          <div className="mt-2 bg-gray-200 h-4 w-1/2 rounded"></div>
        </div>
        ))}
        </div>
      </div>
  );
  }
  
  if (!loading && forYouPosts.length === 0) {
    return <div className="flex bg-white justify-center items-center h-screen">
      <div className="text-2xl font-bold">No posts found</div>
    </div>;
  }

  return (
    <div className="flex">
      <div className="h-screen overflow-y-scroll space-y-10 w-full px-3 mt-4 pb-5 bg-white rounded-md">
        
        <section className="p-3">
          {classType === "forYou" && (
            <div className="w-full text-sm flex justify-between">
              <span className="font-bold text-gray-900">Every Chain Created For You</span>
            </div>
          )}

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
        </section>

        
      </div>
    </div>
  );
};

export default ForYouPiece;
