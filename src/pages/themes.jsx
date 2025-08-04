import React, { useContext, useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import TopHeader from '../components/TopHeader'
import MyCollection from '../components/MyCollection'
import { useActiveAccount } from 'thirdweb/react'
import { useNavigate } from 'react-router-dom'
import { PostsContext } from '../context/PostsContext'
import { PlusIcon } from "lucide-react";
import NftCard from '../components/NftCard'
import Loved from "../assets/icons/loved.svg";
import Heart from "../assets/icons/heart.svg";
import ThemeCard from '../components/ThemeCard'

const Themes = () => {
  const [loading, setLoading] = useState(true);
  const { themes, forYouPosts } = useContext(PostsContext);
  const activeAccount = useActiveAccount();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [])

  return (
    <div>
      <div className="w-full bg-[#f6f2ff]">
        <div className="flex p-4">
          <SideBar />
          <div className="block w-full lg:w-10/12">
            <TopHeader />
            <div className="flex">
                <div className="h-screen overflow-y-scroll space-y-10 w-full px-3 mt-4 pb-5 bg-white rounded-md">
                    
                    <section className="p-3">
                        <div className="w-full text-sm flex justify-between items-center">
                            <span className="font-bold text-gray-900">Themes (ArtWorks, Words, Clips)</span>
                            
                            {activeAccount?.address.toLowerCase() === "0x097753B3EF40ca0676B8d95f59303AcC5f3f42cF".toLowerCase() &&
                            <div onClick={() => navigate("/create_theme")} className="w-full flex justify-end">
                                <button className="w-fit flex items-center gap-2 cursor-pointer text-center bg-[#9e74eb] hover:opacity-90 text-white px-6 py-3 rounded-xl transition duration-300 shadow-md">
                                <span className="text-sm">Create New Theme</span>
                                <PlusIcon className="w-5 h-5" />
                                </button>
                            </div>
                            }

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
                        {themes.map((theme, index) => (
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Themes;