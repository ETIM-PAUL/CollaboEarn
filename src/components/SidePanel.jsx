import React from "react";
import Profile from "../assets/icons/profile.svg";
import { useNavigate } from "react-router-dom";
import { formatDate, formatDateMoment } from "./utils";
const SidePanel = ({ posts }) => {
  const navigate = useNavigate();

  return (
    <div className="w-3/12 min-h-screen bg-white rounded-md mt-4 shadow-lg p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Top Contents</h2>
          <span onClick={() => navigate('/for-you')} className="text-blue-500 text-sm cursor-pointer">See more</span>
        </div>
        <div className="flex flex-col gap-2">
          {posts?.sort((a, b) => Number(b.amount) - Number(a.amount))?.map((post) => (
          <div key={post?.id} className="flex items-center gap-2">
          <img 
          src={
            (post?.type === "artworks" ? post?.content : post.nftImg).startsWith("ipfs://")
              ? (post?.type === "artworks" ? post?.content : post.nftImg).replace("ipfs://", "https://ipfs.io/ipfs/")
              : post.nftImg
          }
           alt="" className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-sm text-gray-900">{post?.title.length > 20 ? post?.title.slice(0, 20) + "..." : post?.title}</p>
              <p className="text-xs text-gray-500">{formatDate(post?.date)}</p>
            </div>
          </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
