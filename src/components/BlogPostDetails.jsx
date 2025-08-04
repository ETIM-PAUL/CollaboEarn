import React, { Fragment, useContext } from 'react';
import { ArrowLeftIcon, Calendar, Type, TypeIcon, TypeOutlineIcon, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { shortenAddress } from 'thirdweb/utils';
import { PostsContext } from '../context/PostsContext';
import SidePanel from './SidePanel';
import { GiMoneyStack } from 'react-icons/gi';
import { MdDescription, MdPeople } from 'react-icons/md';
import { BiCategory } from 'react-icons/bi';
import { FaHashtag } from 'react-icons/fa';
import { abi, contractAddress, formatDate, ipfsToHttp } from './utils';
import { useState } from 'react';
import { ethers } from 'ethers';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import { useActiveAccount } from 'thirdweb/react';


const BlogPostDetails = ({ post, theme }) => {
  const navigate = useNavigate();
  const { forYouPosts } = useContext(PostsContext);
  const activeAccount = useActiveAccount();
  const [modal, setModal] = useState({
    show: false,
    action: null, // 'approve' or 'reject'
  });
  const [loading, setLoading] = useState(false);
console.log(post)
  // Example contract functions
  const approveContribution = async (id) => {
    // Interact with contract here
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
  
      const tx = await contract.approveContribution(Number(post?.id));
      await tx.wait();
      updateContributionStatus(post?.id, true)
      toast.success("Contribution approved!");
      navigate("/for-you")
    } catch (error) {
      toast.error(error)
      setLoading(false);
    }
  };

  const rejectContribution = async (id) => {
    // ...call your contract's reject function
    alert(`Rejected contribution with id: ${id}`);
  };

  // Handler for confirming the modal action
  const handleConfirm = async () => {
    if (modal.action === 'approve') {
      await approveContribution(post.id);
    } else if (modal.action === 'reject') {
      await rejectContribution(post.id);
    }
    setModal({ show: false, action: null });
  };

  // Modal confirmation text
  const confirmationText =
    modal.action === 'approve'
      ? 'Are you sure you want to approve this contribution?'
      : 'Are you sure you want to reject this contribution?';


  // Render content based on type
  let mainContent;
  if (post?.type === "clips") {
    mainContent = (
      <video
        src={ipfsToHttp(post.content)}
        controls
        style={{ width: "100%", height:"300px", objectFit:"contain", borderRadius: "1.5rem", boxShadow: "0 2px 8px #0001" }}
      />
    );
  } else if (post?.type === "artworks" || post?.type === "words") {
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
          {post?.type !== "clips" &&
            <div className="absolute rounded-b-3xl flex items-center justify-center top-0 bottom-0 left-0 right-0">
              <h1 className="text-3xl md:text-4xl text-black font-extrabold text-center drop-shadow-xl bg-white/90 p-6 rounded-xl">
                {post?.title}
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
                <span>{shortenAddress(post?.creator)}</span>
              </div>
              <div className="flex w-full items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post?.date)}</span>
              </div>
            </div>

            {/* Approve Button */}
            {(post?.approved === false && activeAccount?.address.toLowerCase() === "0x097753B3EF40ca0676B8d95f59303AcC5f3f42cF".toLowerCase()) &&
              <button
                disabled={loading}
                onClick={() => setModal({ show: true, action: 'approve' })}
                className="w-fit bg-[#9e74eb] cursor-pointer hover:opacity-90 text-white p-2 mt-3 flex justify-center gap-2 items-center rounded-lg"
              >
                <span className="font-semibold">Approve</span>
              </button>
            }

            {(post?.approved === false && activeAccount?.address.toLowerCase() !== "0x097753B3EF40ca0676B8d95f59303AcC5f3f42cF".toLowerCase()) &&
              <button
                disabled={true}
                className="w-fit cursor-not-allowed bg-[#9e74eb] hover:opacity-90 text-white p-2 mt-3 flex justify-center gap-2 items-center rounded-lg"
              >
                <span className="font-semibold">Pending Approval</span>
              </button>
            }

            {/* Reject Button */}
            {/* <button
              onClick={() => setModal({ show: true, action: 'reject' })}
              className="w-full bg-red-500 cursor-pointer hover:opacity-90 text-white p-2 mt-3 flex justify-center gap-2 items-center rounded-lg"
            >
              <span className="font-semibold">Reject</span>
            </button> */}

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
              <p className="text-lg font-bold text-green-600">${ethers.utils.formatEther(theme?.amount)}</p>
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
          <div className="bg-gray-100 p-4 rounded-xl w-full">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MdPeople /> Maximum Collaborators
            </p>
            <p className="text-xl font-bold text-gray-800">{theme?.maxCollaborators}</p>
          </div>
        </div>
      </div>
      </div>


      {/* Headless UI Confirmation Modal */}
      <Transition appear show={modal.show} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setModal({ show: false, action: null })}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-40"
            leave="ease-in duration-200"
            leaveFrom="opacity-40"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-semibold text-center mb-6">
                    {confirmationText}
                  </Dialog.Title>
                  <div className="flex justify-between gap-4">
                    <button
                      onClick={() => setModal({ show: false, action: null })}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirm}
                      className={`flex-1 ${
                        modal.action === 'approve'
                          ? 'bg-[#9e74eb]'
                          : 'bg-red-500'
                      } hover:opacity-90 text-white py-2 rounded`}
                    >
                      {loading ? "Processing":"Confirm"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default BlogPostDetails;