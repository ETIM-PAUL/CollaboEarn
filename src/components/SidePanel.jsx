import React from "react";
import Profile from "../assets/icons/profile.svg";
import { useNavigate } from "react-router-dom";
import { formatDateMoment } from "./utils";
const SidePanel = ({ posts }) => {
  const navigate = useNavigate();

  return (
    <div className="w-3/12 min-h-screen bg-white rounded-md mt-4 shadow-lg p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Top Posts</h2>
          <span onClick={() => navigate('/for-you')} className="text-blue-500 text-sm cursor-pointer">See more</span>
        </div>
        <div className="flex flex-col gap-2">
          {posts?.sort((a, b) => Number(b.marketCapDelta24h) - Number(a.marketCapDelta24h))?.map((post) => (
          <div key={post?.address} className="flex items-center gap-2">
          <img src={Profile} alt="" className="w-10 h-10" />
            <div>
              <p className="text-sm text-gray-900">{post?.name.length > 20 ? post?.name.slice(0, 20) + "..." : post?.name}</p>
              <p className="text-xs text-gray-500">{formatDateMoment(post?.createdAt)}</p>
            </div>
          </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
