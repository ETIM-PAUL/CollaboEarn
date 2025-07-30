import React, { useContext, useState, useEffect } from 'react'
import { ArrowLeftIcon, Calendar, PlusIcon, User } from "lucide-react";
import { PostsContext } from '../context/PostsContext';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { GiMoneyStack } from 'react-icons/gi';
import TipModal from './TipModal';
import darkMarket from "../assets/icons/darkMarket.svg";
import PromptModal from './PromptModal';
import { useAccount, useBalance } from 'wagmi';
import EthModal from './BuySellModal';
import { getCoin, getProfileBalances } from '@zoralabs/coins-sdk';
import { base, baseSepolia } from 'viem/chains';
import {formatDate } from './utils';
import { FaCoins, FaHashtag, FaAddressCard, FaChartLine, FaCubes, FaUsers, FaExchangeAlt, FaHistory, FaExternalLinkAlt, FaUserCircle } from "react-icons/fa";

const BlogPostDetails = () => {
  const { address, isConnected } = useAccount();
  const { allUsers } = useContext(PostsContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [coinDetails, setCoinDetails] = useState();
  const [userCoinBalance, setUserCoinBalance] = useState(0);
  const { data: ethBalance } = useBalance({
    address: address,
  })
  
  const getUserName = (address) => {
    const user = allUsers.find((user) => user.userAddress.toLowerCase() === address.toLowerCase());

    return user?.username;
  }

  async function fetchCoinDetails() {
      try {
      const response = await getCoin({
        address: id,
        chain: base?.id
      });
      
      if (response?.data?.zora20Token) {
        setCoinDetails(response?.data?.zora20Token);
        console.log(response?.data?.zora20Token);
        setIsLoading(false);
      } else {
        toast.error("Error fetching coin details");
      }
    } catch (error) {
      console.error("Error fetching coin details:", error);
      toast.error("Error fetching coin details");
    }
  }

  const getUserBalance = async (erc20contract) => {
    // Initialize provider and contract
    const result = await getProfileBalances(
      {
        identifier: address, // Can also be zora user profile handle
        count: 50,        // Optional: number of balances per page
        after: undefined, // Optional: for pagination
      }
    )
    setUserCoinBalance(result?.data?.profile?.coinBalances?.edges?.find((coin) => coin?.node?.coin?.address === erc20contract)?.node?.balance);
  };

  useEffect(() => {
    fetchCoinDetails();
    getUserBalance(id);
  }, []);


  const handlePurchase = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsPurchaseModalOpen(false);
      toast.success('Purchase successful');
      onClose();
    }, 1000);
  };


  if (!loading && !coinDetails?.address) {
    return <div className='text-center mt-4 text-2xl h-screen flex items-center justify-center'>Post not found</div>;
  }

  
  if (isLoading) {
    return (
      <div className="bg-white px-5 min-h-screen text-gray-800">
        {/* Back Button Skeleton */}
        <div className="flex items-center gap-2 pt-4">
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Banner Skeleton */}
        <div className="relative mt-4">
          <div className="w-full h-[60vh] bg-gray-200 rounded-3xl animate-pulse"></div>
          <div className="absolute rounded-b-3xl flex items-center justify-center top-0 bottom-0 left-0 right-0">
            <div className="h-12 w-64 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center w-full gap-4 mb-8">
            {/* User and Date Skeleton */}
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex-grow flex justify-end">
              <div className="h-12 w-40 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>

          {/* Content Paragraphs Skeleton */}
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }


  if (!isLoading && coinDetails?.address) {
  return (
    <div className="flex">
    <div className="bg-white px-5 min-h-screen text-gray-800">

      {/* Back Button */}
      <div className="flex items-center gap-2 pt-4">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700 flex items-center gap-2 cursor-pointer">
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Banner */}
      <div className="relative mt-4">
        <img
          src={coinDetails?.mediaContent?.previewImage?.medium}
          alt="Banner"
          className="w-full h-[60vh] object-cover rounded-3xl shadow-lg"
        />
        <div className="absolute rounded-b-3xl flex items-center justify-center top-0 bottom-0 left-0 right-0">
          <h1 className="text-5xl md:text-6xl text-black font-extrabold text-center drop-shadow-xl bg-white/90 p-4 rounded-xl">
            {coinDetails?.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center w-full gap-4 text-gray-500 text-sm mb-8">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{getUserName(coinDetails?.creatorAddress)}</span>
          </div>
          <div className="flex w-full items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(coinDetails?.createdAt)}</span>
          </div>

            <div className="flex items-center w-full gap-2">
                <div className="flex items-center w-full">
                  <button
                    onClick={() => isConnected ? setIsPurchaseModalOpen(true) : toast.error('Please connect your wallet to trade coins')}
                  className="w-full flex items-center gap-2 cursor-pointer justify-center bg-[#9e74eb] hover:opacity-90 text-white py-3 rounded-xl transition duration-300 shadow-md"
                >
                  <span className="text-sm text-center">Trade Coins</span>
                  <img src={darkMarket} alt="" className="w-5 h-5" />
                </button>
              </div>

              {(coinDetails?.creatorAddress.toLowerCase() !== address.toLowerCase()) && (
              <div className="flex items-center w-full">
                  <button
                    onClick={() => isConnected ? setIsModalOpen(true) : toast.error('Please connect your wallet to tip content')}
                    className="w-fit flex items-center gap-2 cursor-pointer text-center bg-[#9e74eb] hover:opacity-90 text-white px-6 py-3 rounded-xl transition duration-300 shadow-md"
                  >
                    <span className="text-sm">Tip</span>
                    <GiMoneyStack className="w-5 h-5" />
                  </button>
              </div>
            )}

            </div>
        </div>

        <div dangerouslySetInnerHTML={{ __html: coinDetails?.description }} />
      </div>

      {/* Tip Modal */}
      <TipModal
      coinDetails={coinDetails}
      address={address}
      userCoinBalance={userCoinBalance}
        isOpen={isModalOpen}
        getUserBalance={getUserBalance}
        onClose={() => setIsModalOpen(false)}
      />


      {isPurchaseModalOpen && (
        <EthModal
          ethBalance={ethBalance?.formatted?.slice(0, 7)}
          userCoinBalance={userCoinBalance}
          onSell={handlePurchase}
          onBuy={handlePurchase}
          onClose={() => setIsPurchaseModalOpen(false)}
          loading={purchaseLoading}
          setLoading={setPurchaseLoading}
          address={address}
          coinDetails={coinDetails}
          erc20Address={id}
        />
      )}

    </div>

    <div className="w-[30%] min-h-screen bg-white rounded-md mt-4 shadow-lg p-4">
      <div className='flex flex-col gap-4'>
        <div className="mt-6 flex flex-col md:flex-row md:justify-between items-start md:items-center">
          <div>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <FaHashtag /> Token Symbol: {coinDetails.symbol}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FaAddressCard /> Address: {coinDetails?.address.slice(0, 6)}...{coinDetails?.address.slice(-4)}
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col md:flex-row md:justify-between items-start md:items-center">
          <div className="mt-4 md:mt-0 flex gap-4">
            <div className="">
              <p className="text-gray-700 font-semibold flex items-center gap-1 justify-center">
                <FaChartLine /> Market Cap
              </p>
              <p className="text-lg font-bold text-green-600">${coinDetails?.marketCap}</p>
            </div>
            <div className="">
              <p className="text-gray-700 font-semibold flex items-center gap-1">
                <FaCubes /> Total Supply
              </p>
              <p className="text-lg font-bold">{coinDetails?.totalSupply} {coinDetails?.symbol}</p>
            </div>
          </div>
        </div>

        {/* Token Economics */}
        <div className="mt-6 gap-4 space-y-4">
          <div className="bg-gray-100 p-4 rounded-xl w-full">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FaUsers /> Unique Holders
            </p>
            <p className="text-xl font-bold text-gray-800">{coinDetails?.uniqueHolders}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-xl w-full">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FaExchangeAlt /> Volume (24h)
            </p>
            <p className="text-xl font-bold text-gray-800">{coinDetails?.volume24h}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-xl w-full">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FaExchangeAlt /> Total Volume
            </p>
            <p className="text-xl font-bold text-gray-800">{coinDetails?.totalVolume}</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
  }
}

export default BlogPostDetails