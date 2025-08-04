import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import { PostsContext } from "../context/PostsContext";
import { Heart, MessageCircle, Share, Bookmark, Play, Pause, Volume2, VolumeX, MoreHorizontal, Currency, DollarSign } from 'lucide-react';
import { shortenAddress } from "thirdweb/utils";
import TipModal from "./TipModal";
import { useActiveAccount, useActiveWallet, useActiveWalletChain, useWalletBalance } from "thirdweb/react";
import { clientThirdweb } from "../../client";
import { FaBookReader, FaDollarSign, FaMoneyBill } from "react-icons/fa";
import { GiEyeball, GiTakeMyMoney } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { ethers } from 'ethers';
import { ipfsToHttp } from "./utils";


  const PostSkeleton = () => (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg animate-pulse">
      <div className="p-6">
        {/* Author skeleton */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
        </div>
        
        {/* Content skeleton */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
      </div>
      
      {/* Media skeleton */}
      <div className="h-64 bg-gray-200"></div>
      
      {/* Actions skeleton */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
          </div>
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );

  // Video Player Component
  const VideoPlayer = ({ thumbnail, title, isPlaying, onPlayPause, videoUrl }) => {
    const videoRef = useRef(null);
    const [duration, setDuration] = useState(0);
    

    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration);
      }
    };
    
    return (
      <div className="relative group cursor-pointer" onClick={onPlayPause}>
        <video
        ref={videoRef}
        src={ipfsToHttp(videoUrl)}
        controls={true}
        // poster={thumbnail}
        autoPlay={isPlaying}
        onLoadedMetadata={handleLoadedMetadata}
        className="w-full h-64 object-contain z-10"
      />
      </div>
    );
  };

  // Post Component
  const Post = ({ post, balance }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [tipModal, setTipModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const activeAccount = useActiveAccount();
    const navigate = useNavigate();
  

    
    

    const renderContent = () => {
      switch (post.type) {
        case 'artworks':
          return (
            <div className="relative group overflow-hidden">
              <img 
                src={
                  (post?.type === "artworks" ? post?.content : post.nftImg).startsWith("ipfs://")
                    ? (post?.type === "artworks" ? post?.content : post.nftImg).replace("ipfs://", "https://ipfs.io/ipfs/")
                    : post.nftImg
                }
                alt={post.title}
                className="w-full h-64 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 text-white">
                  {/* <p className="text-sm font-medium">View Full Details</p> */}
                </div>
              </div>
            </div>
          );
        
        case 'clips':
          return (
            <VideoPlayer 
              thumbnail={post.nftImg}
              title={post.title}
              isPlaying={isVideoPlaying}
              videoUrl={post.content}
              onPlayPause={() => setIsVideoPlaying(!isVideoPlaying)}
            />
          );
        
        case 'words':
          return (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border-l-4 border-indigo-500">
              <p className="text-gray-700 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: post?.content?.length > 200 ?  post?.content?.slice(0,200) + "....." : post?.content}} />
              <div className="flex items-center justify-between">
                <span className="text-indigo-600 font-medium text-sm">{post.readTime}</span>
                <button onClick={()=>navigate(`/blog_details/${post.id}`)} className="text-indigo-600 cursor-pointer hover:text-indigo-800 font-medium text-sm transition-colors">
                  Read More →
                </button>
              </div>
            </div>
          );
        
        default:
          return null;
      }
    };

    const handleTip = (post) => {
      setSelectedPost(post)
      setTipModal(true);
    };

    return (
      <div>

      <article className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Author Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img 
                src={
                  (post?.type === "artworks" ? post?.content : post.nftImg).startsWith("ipfs://")
                    ? (post?.nftImg === "" ? post?.content : post.nftImg).replace("ipfs://", "https://ipfs.io/ipfs/")
                    : post.nftImg
                }
                alt={post.author}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{shortenAddress(post.creator)}</h3>
                <p className="text-gray-500 text-sm">{post.date}</p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Post Title and Description */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
          </div>
        </div>
        
        {/* Content */}
        {renderContent()}
        
        {/* Actions */}
        <div className="p-6 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              
              <button onClick={()=>navigate(`/blog_details/${post.id}`)} className="text-gray-500 hover:text-green-500 transition-colors">
                <FaBookReader className="w-6 h-6 cursor-pointer" />
              </button>
            </div>
            
            <button 
              className={`transition-colors flex gap-1 ${
                isBookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'
              }`}
              onClick={() => handleTip(post)}
            >
              <span>Tip</span>
              <GiTakeMyMoney className={`w-6 h-6 text-green-500 cursor-pointer`} />
            </button>
          </div>
        </div>
      </article>

        {/* Tip Modal */}
        {activeAccount?.address &&
        <TipModal
          post={selectedPost}
          isOpen={tipModal}
          onClose={() => setTipModal(false)}
          userCoinBalance={balance}
        />
        }
      </div>
      
    );
    
  };

  // Main Component
  const ForYouPiece = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [balance, setBalance] = useState();
    const activeAccount = useActiveAccount();


    const observer = useRef();

    const { approvedPosts:forYouPosts } = useContext(PostsContext);

    // Simulate API call
    const loadPosts = useCallback(async (pageNum) => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const startIndex = (pageNum - 1) * 3;
      const newPosts = forYouPosts.slice(startIndex, startIndex + 3).map(post => ({
        ...post,
        id: post.id + (pageNum - 1) * forYouPosts.length
      }));
      
      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setHasMore(newPosts.length === 3);
      setLoading(false);
    }, [forYouPosts]);

    // Intersection Observer for infinite scroll
    const lastPostElementRef = useCallback(node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      });
      
      if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const getBalance = async () => {
      if (window.ethereum && activeAccount?.address) {
      const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
      const balanceFunds = await provider.getBalance(activeAccount?.address);
      setBalance(ethers.utils.formatEther(balanceFunds))
      }
  
    }

    useEffect(() => {
      getBalance()
    }, [activeAccount?.address])


    // Load more posts when page changes
    useEffect(() => {
      loadPosts(page);
    }, [page, loadPosts]);

    // Initial load
    useEffect(() => {
      loadPosts(1);
    }, [loadPosts]);

    // Now, after all hooks, you can do early returns:
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
      <div className="mt-4 w-full bg-white rounded-md">
        {/* Sticky Header */}
        <header className="stick top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-center">
              For You
            </h1>
          </div>
        </header>

        {/* Feed Container */}
        <main className="h-screen overflow-y-scroll px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="space-y-8">
              {posts.map((post, index) => {
                if (posts.length === index + 1) {
                  return (
                    <div ref={lastPostElementRef} key={post.id}>
                      <Post post={post} balance={balance} />
                    </div>
                  );
                } else {
                  return <Post key={post.id} post={post} />;
                }
              })}
              
              {/* Loading Skeletons */}
              {loading && (
                <>
                  <PostSkeleton />
                  <PostSkeleton />
                  <PostSkeleton />
                </>
              )}
              
              {/* End of feed message */}
              {!hasMore && posts.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 font-medium">You've reached the end of your feed</p>
                  <p className="text-gray-400 text-sm mt-1">Check back later for more content</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  };


export default ForYouPiece;
