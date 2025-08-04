import React, { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowRightIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";
import heroImage from "../assets/coinwrite-hero.png"; // Replace with actual hero image path
import HomePageHeader from "../components/HomePageHeader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import RegisterModal from '../components/RegisterModal';
import { plans } from "../components/utils";
import { PostsContext } from "../context/PostsContext";
import { SlArrowDown, SlArrowRight } from "react-icons/sl";
import { FaPlaneSlash, FaWallet, FaShieldAlt, FaCoins, FaGlobe, FaClock, FaRocket } from "react-icons/fa";
import { TbCancel, TbPlane } from "react-icons/tb";
import { BiSolidHourglassTop } from "react-icons/bi";
import { MdOutlineFlightTakeoff, MdOutlineFlightLand } from "react-icons/md";
import { useActiveAccount, useActiveWallet, useActiveWalletChain, useConnectModal, useWalletBalance } from "thirdweb/react";
import { clientThirdweb } from "../../client";

const categories = [
  "Adventure", "Sci-Fi", "Fantasy", "Romance", "Mystery", "Horror", "History",
  "Biography", "Comedy", "Drama", "Thriller", "Poetry", "Folklore",
  "Mythology", "Satire", "Children", "Spiritual"
];

const steps = [
  {
    number: "01",
    title: "Facilitators Add Theme",
    description: "Facilitators on CollaboEarn create story themes to guide writers and spark collaborative storytelling.",
    icon: <MdOutlineFlightTakeoff className="text-2xl" />
  },
  {
    number: "02",
    title: "Collaborators Contribute Content",
    description: "Collaborators explore themes and submit creative content aligned with them. Multiple entries allowed.",
    icon: <BiSolidHourglassTop className="text-2xl" />
  },
  {
    number: "03",
    title: "Approval & Publishing",
    description: "Facilitators review and approve high-quality content, publishing them to the public for reading.",
    icon: <FaCoins className="text-2xl" />
  },
  {
    number: "04",
    title: "Readers Tip the Theme",
    description: "The community view published content (artworks, clips, words) and tips their favorite themes. Tips are shared among all approved collaborators.",
    icon: <FaWallet className="text-2xl" />
  }
];

function LandingPage() {
  const navigate = useNavigate()
  const { connect } = useConnectModal();

  const account = useActiveAccount();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const registerUser = (title) => {
    if(!isConnected) {
      toast.error("Please connect your wallet to register");
    }
    else {
      setSelectedPlan(title);
      setIsRegisterModalOpen(true);
    }
  }
  const { coinDetails, allUsers } = useContext(PostsContext);

  const getUserName = (address) => {
    const user = allUsers.find((user) => user.userAddress.toLowerCase() === address.toLowerCase());

    return user?.username;
  }

  async function handleConnect() {
    const wallet = await connect({ clientThirdweb });
  }


  return (
      <div className="px-8">
        <HomePageHeader />
        <div className="bg-[#f6f2ff] rounded-xl border border-[#f6f2ff] px-0 md:px-8 text-gray-900 scroll-smooth">

        {/* Hero Section */}
        <section className="pt-16">
          <div className="mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="gap-6 flex flex-col items-start max-w-[400px]">
              <h2 className="w-full h-full overflow-hidden text-4xl leading-12 font-extrabold text-left whitespace-pre-line break-words opacity-100 visible">
                Share Content. Earn Tokens. Inspire the World.
              </h2>
              <p className="text-gray-600 text-lg whitespace-pre-line break-words text-start">
              CollaboEarn is a Web3 storytelling platform where your imagination turns into collectible and monetizable content (artworks, clips and words) powered by Etherlink.
              </p>
              <button onClick={() => account?.address ? navigate('/publish_story') : handleConnect()} className="w-[200px] cursor-pointer text-center bg-[#9e74eb] hover:opacity-90 text-white px-6 py-3 rounded-xl transition duration-300 shadow-md">
                <span className="text-sm">Start Writing</span>
              </button>
            </div>
            <div className="hidden md:block">
              <img src={heroImage} alt="CollaboEarn Illustration" className="w-full h-auto" />
            </div>
          </div>
        </section>

        {/* Explore Section */}
        <section id="explore" className="py-16 px-6">
          <div className="mx-auto">
            <h3 className="text-2xl font-medium mb-8 text-center">Explore Popular Themes</h3>
            <div className="flex flex-wrap gap-4">
              {coinDetails.length > 0 && coinDetails.slice(0, 4).map((story, index) => (
                <div key={index} onClick={() => navigate(`/story_details/${story?.address}`)} className="grow max-w-[300px] cursor-pointer">
                  <div className="relative w-full h-64 overflow-hidden rounded-lg shadow-lg">
                    <img src={story?.mediaContent?.previewImage?.medium} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="relative mt-2 text-black text-start">
                    <h2 className="text-md font-semibold">{story?.name}</h2>
                    <p className="mt-1 text-sm text-gray-600">{getUserName(story?.creatorAddress)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">How ContentChain Works</h2>
        <p className="text-center text-gray-400 mb-12">
          Inspired by a theme, submit your inspo (artwork, words or clips) and earn as a collaborator.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-[#fff] rounded-2xl p-8 flex flex-col items-center text-center shadow-lg hover:shadow-purple-400/20 transition-shadow duration-300">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#9e74eb] text-white text-4xl mb-4">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-[#9e74eb]">{step.title}</h3>
              <p className="text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

        {/* Categories Section */}
        <section id="categories" className="py-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-2xl font-medium mb-8">Story Genres</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className={
                    !['A', 'E', 'I', 'O', 'U'].includes(cat[0].toUpperCase())
                      ? "cursor-pointer bg-white px-8 text-[#9e74eb] border border-[#fff] px-4 py-2 rounded-full text-sm font-medium"
                      : "cursor-pointer bg-[#9e74eb] px-8 text-[#fff] border border-[#9e74eb] px-4 py-2 rounded-full text-sm font-medium"
                  }
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section id="plans" className="py-20 hidden px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h3 className="text-2xl font-medium mb-10">Choose Your Creator Plan</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {plans.map((plan) => (
                <div key={plan.title} className="bg-white cursor-pointer p-6 text-start rounded-xl border border-gray-200 shadow">
                  <h4 className="text-lg font-normal mb-1">{plan.title}</h4>
                  <p className="text-3xl font-extrabold text-[#9e74eb] mb-4">{plan.price}</p>
                  <div className="text-sm text-gray-700 mb-4 space-y-4 py-6">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 w-full">
                        <CheckBadgeIcon className="w-5 h-5" />
                        <span className="whitespace-pre-line break-words">{feat}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => registerUser(plan.title)} className="bg-[#9e74eb] cursor-pointer text-white px-4 py-2 rounded-md w-full text-sm font-medium hover:opacity-90">Select</button>
                </div>
              ))}
            </div>
          </div>
        </section>
        </div>

        <footer className="py-10 text-center text-gray-500">
          &copy; 2025 CollaboEarn. All rights reserved. Powered by Etherlink Chain
        </footer>

        <RegisterModal 
          plan={selectedPlan}
          isOpen={isRegisterModalOpen} 
          setIsOpen={setIsRegisterModalOpen}
        />
      </div>
  );
}

export default LandingPage;