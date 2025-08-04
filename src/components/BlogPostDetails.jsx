import React, { useContext } from 'react';
import { ArrowLeftIcon, Calendar, Type, TypeIcon, TypeOutlineIcon, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { shortenAddress } from 'thirdweb/utils';
import { PostsContext } from '../context/PostsContext';
import SidePanel from './SidePanel';
import { GiMoneyStack } from 'react-icons/gi';
import { MdDescription, MdPeople } from 'react-icons/md';
import { BiCategory } from 'react-icons/bi';
import { FaHashtag } from 'react-icons/fa';

// Simple date formatter (replace with your util if needed)
const formatDate = (date) => date;

const BlogPostDetails = ({ post, theme }) => {
  const navigate = useNavigate();
  const { forYouPosts } = useContext(PostsContext);


  // Render content based on type
  let mainContent;
  if (post.type === "video") {
    mainContent = (
      <video
        src={post.content}
        controls
        style={{ width: "100%", height:"300px", objectFit:"contain", borderRadius: "1.5rem", boxShadow: "0 2px 8px #0001" }}
      />
    );
  } else if (post.type === "artworks" || post.type === "words") {
    mainContent = (
      <img
        src={(post?.type === "artworks" ? post?.content : post.nftImg).replace("ipfs://", "https://ipfs.io/ipfs/")}
        alt={post.title}
        className="w-full h-[60vh] object-cover rounded-3xl shadow-lg"
      />
    );
  }

  return (
    <div className="flex mt-4">
      <div className="bg-white rounded-md px-20 min-h-screen text-gray-800 w-9/12 ">
        {/* Back Button */}
        <div className="flex items-center gap-2 pt-4">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700 flex items-center gap-2 cursor-pointer">
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Banner or Main Content */}
        <div className="relative mt-4">
          {mainContent}
          {post.type !== "video" &&
            <div className="absolute rounded-b-3xl flex items-center justify-center top-0 bottom-0 left-0 right-0">
              <h1 className="text-3xl md:text-4xl text-black font-extrabold text-center drop-shadow-xl bg-white/90 p-6 rounded-xl">
                {post.title}
              </h1>
            </div>
          }
        </div>

        {/* Meta Info */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between w-full gap-4 text-gray-500 text-sm mb-8">
            <div className="flex items-center w-full gap-4 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{shortenAddress(post.creator)}</span>
              </div>
              <div className="flex w-full items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.date)}</span>
              </div>
            </div>

          </div>
          {/* Description */}
          <div className="mb-6 text-lg text-gray-700"  dangerouslySetInnerHTML={{ __html: (post.type === "words" ? post?.content : post?.description)}} />
        </div>
      </div>

      <div className="w-[30%] min-h-screen bg-white rounded-md mt-4 shadow-lg p-4">
      <div className='flex flex-col gap-4'>
        <span>Theme Details</span>
        <div className="mt-6 flex flex-col md:flex-row md:justify-between items-start md:items-center">
          <div>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <FaHashtag /> Theme: {theme?.theme}
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col md:flex-row md:justify-between items-start md:items-center">
          <div className="mt-4 md:mt-0 flex flex-col gap-4">
            <div className="flex gap-1">
              <p className="text-gray-700 font-semibold flex items-center gap-1 justify-center">
                <GiMoneyStack /> Tips - 
              </p>
              <p className="text-lg font-bold text-green-600">${theme?.amount}</p>
            </div>
            <div className="">
              <p className="text-gray-700 font-semibold flex items-center gap-1">
                <MdDescription /> Description
              </p>
              <p className="text-sm font-medium mt-1">{theme?.description}</p>
            </div>
          </div>
        </div>

        {/* Token Economics */}
        <div className="mt-6 gap-4 space-y-4">
          <div className="bg-gray-100 p-4 rounded-xl w-full">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <BiCategory /> Category
            </p>
            <p className="text-xl font-bold text-gray-800">{theme?.category}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-xl w-full">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MdPeople /> Total Collaborators
            </p>
            <p className="text-xl font-bold text-gray-800">{theme?.collaborators}</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default BlogPostDetails;