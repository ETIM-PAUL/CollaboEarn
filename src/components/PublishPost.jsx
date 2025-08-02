import React, { useEffect, useState, useContext } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { Dialog, Transition } from "@headlessui/react";
import { Eye, ImagePlus, PlusIcon } from "lucide-react";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";
import { GiArtificialIntelligence } from "react-icons/gi";
// import { LMStudioClient } from "@lmstudio/sdk";
import axios from "axios";
import { base, baseSepolia } from "viem/chains";
import { useNavigate } from "react-router-dom";
import { abi, coinContract } from "./utils";
import { PostsContext } from "../context/PostsContext";
import { ethers } from "ethers";
import { useActiveAccount } from "thirdweb/react";
import { BiVideoPlus } from "react-icons/bi";


const CreatePost = ({type, theme}) => {
  const [promptRegister, setPromptRegister] = useState(false);
  const [title, setTitle] = useState("");
  const [banner, setBanner] = useState(null);
  const [category, setCategory] = useState(null);
  const [content, setContent] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [aiAnalyze, setAiAnalyze] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [publishedBannerUrl, setPublishedBannerUrl] = useState("");
  const [confirmAnalyzeOpen, setConfirmAnalyzeOpen] = useState(false);
  const [optimizedContentOpen, setOptimizedContentOpen] = useState(false);
  const [optimizedContent, setOptimizedContent] = useState("");
  const activeAccount = useActiveAccount()
  const navigate = useNavigate()

  const { addCoinAddress, setCoinAddresses, setCoinsDetails } = useContext(PostsContext);
  
  if (!activeAccount) {
    toast.error("Please connect your wallet");
    navigate("/collection");
  }
  // const client = new LMStudioClient();
  
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setBanner(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToIPFS = async(base64Image) => {
    try {
      // Convert base64 to blob
      const response = await fetch(base64Image);
      const blob = await response.blob();
      
      // Create a File object from the blob
      const file = new File([blob], 'image.jpg', { type: blob.type });
      
      const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: import.meta.env.VITE_IPFS_JWT,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(`Upload failed: ${error.error || 'Unknown error'}`);
      }

      const data = await res.json();
      setPublishedBannerUrl(`ipfs://${data?.IpfsHash}`)
      return data
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      throw error;
    }
  }

  const publishPost = async(filename = "metadata.json") => {
    if (!title || !content || !banner) {
      toast.error("Please fill in all fields");
      return;
    }

    setPublishing(true);

    try {
      // Upload banner image to IPFS
      const imageUrl = await uploadImageToIPFS(banner);
      
      // Upload content to IPFS
      const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

      // Create metadata JSON
      const metadata = {
        name: title,
        description: content,
        image: "ipfs://" + imageUrl.IpfsHash,
        properties: {
          category: category
        }
      };

      const blob = new Blob([JSON.stringify(metadata)], { type: "application/json" });

      const formData = new FormData();
      formData.append("file", blob, filename);


      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: import.meta.env.VITE_IPFS_JWT,
        },
      });


      if (response.status === 200) {
        const cid = response.data.IpfsHash;
        const contentUrl = `https://ipfs.io/ipfs/${cid}`;
        setPublishedUrl(contentUrl);

      } else {
        throw new Error("IPFS upload failed.");
      }
    } catch (error) {
      console.error("Error creating coin:", error);
      toast.error("Failed to create coin");
      setPublishing(false);
    }
  };


  const confirmAnalyze = async () => {
    setAiAnalyze(true);
    try {
      const response = await fetch("http://localhost:1234/api/v0/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemma-3-1b", // Replace with the model identifier from LM Studio
          messages: [{ role: "user", content:`${content} Based on the blog post (content). Remove all grammatical errors and make it less flawed and more engaging. Just return the optimized content, no other text. Make sure to add needed tags to the content` }],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      setOptimizedContent(data.choices[0].message.content);
      setConfirmAnalyzeOpen(false);
      setOptimizedContentOpen(true);
      setAiAnalyze(false);
    } catch (error) {
      setAiAnalyze(false);
      console.error("Error sending request to LM Studio:", error);
      throw error;
    }
  };

  const copyOptimizedContent = () => {
    navigator.clipboard.writeText(optimizedContent);
    toast.success("Optimized content copied to clipboard");
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-10 px-6 md:px-16">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 space-y-6">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center">Collaborate and Earn</h1>

        {/* Title Input */}
        <label className="block text-sm font-medium text-gray-600">{theme.type === "words" ? "Article Title" : theme.type === "artworks" ? "Artwork Name": "Video Title"}</label>
        <input
          type="text"
          placeholder="Enter blog title"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />


        {/* Banner Image Upload */}
        {theme.type !== "video" &&
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">{theme.type === "words" ? "Banner Image" : "Art Work"}</label>
            <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500">
              <ImagePlus className="w-6 h-6 text-gray-500" />
              <span className="text-gray-700">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {banner && (
              <img
                src={banner}
                alt="Preview"
                className="mt-2 rounded-xl w-full object-cover max-h-60 shadow-md"
              />
            )}
          </div>
        }
        {theme.type === "video" &&
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">{theme.type === "words" ? "Banner Image" : "Art Work"}</label>
            <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500">
              <BiVideoPlus className="w-6 h-6 text-gray-500" />
              <span className="text-gray-700">Upload Clip</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {banner && (
              <video
                src={banner}
                controls
                alt="Preview"
                className="mt-2 rounded-xl w-full object-contain max-h-60 shadow-md"
              />
            )}
          </div>
        }

        {/* SunEditor */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">{theme.type === "words" ? "Article Content" : theme.type === "artworks" ? "Artwork Description" : "Video Description"}</label>
          <SunEditor
            height="300px"
            setContents={content}
            onChange={setContent}
            setOptions={{
              buttonList: [
                ['undo', 'redo'],
                ['font', 'fontSize', 'formatBlock'],
                ['paragraphStyle', 'blockquote'],
                ['bold', 'underline', 'italic'],
                ['fontColor', 'hiliteColor'],
                ['align', 'list', 'indent', 'outdent'],
                ['link'],
                ['fullScreen', 'showBlocks']
              ]
            }}
            
          />
        </div>

        <div className="flex justify-between">

        {/* AI Analyze Button */}
        <div className="flex hidden justify-end gap-2">
            <button
              disabled={publishing || aiAnalyze}
                onClick={() => content.length === 0 ? toast.error("Post can't be empty") : content.length < 100 ? toast.error("At least 100 words is needed to run AI Analysis") : setConfirmAnalyzeOpen(true)}
              className="w-fit flex items-center gap-2 cursor-pointer text-center bg-[#9e74eb] hover:opacity-90 text-white px-6 py-3 rounded-xl transition duration-300 shadow-md"
            >
                  <span className="text-sm">AI Analyze</span>
                  <GiArtificialIntelligence className="w-5 h-5" />
            </button>

        </div>

        {/* Preview Button */}
        <div className="flex justify-end gap-2">
            <button
              disabled={publishing || aiAnalyze}
                onClick={() => setPreviewOpen(true)}
              className="w-fit flex items-center gap-2 cursor-pointer text-center bg-gray-400 hover:opacity-90 text-white px-6 py-3 rounded-xl transition duration-300 shadow-md"
            >
              <span className="text-sm">Preview</span>
              <Eye className="w-5 h-5" />
            </button>

            <button
              disabled={aiAnalyze}
              onClick={() => publishPost()}
              className="w-fit flex items-center gap-2 cursor-pointer text-center bg-[#9e74eb] hover:opacity-90 text-white px-6 py-3 rounded-xl transition duration-300 shadow-md"
            >
              {publishing ? (
                <VscLoading className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="text-sm">Publish</span>
                  <PlusIcon className="w-5 h-5" />
                </>
              )}
              </button>
        </div>

        </div>
      </div>

      {/* Preview Modal */}
      <Transition appear show={previewOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setPreviewOpen(false)}>
          <Transition.Child
            as={React.Fragment}
            enter=""
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-6">
            <Transition.Child
              as="div"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-auto max-h-[90vh] p-6"
            >
              <Dialog.Title className="text-2xl font-bold mb-4 text-center text-gray-800">Post Preview</Dialog.Title>
              {banner && (
                <img
                  src={banner}
                  alt="Banner"
                  className="rounded-xl mb-6 w-full object-cover max-h-72 shadow"
                />
              )}
              <h2 className="text-3xl font-bold mb-4">{title}</h2>
              <div
                className="prose max-w-none prose-blue prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: content }}
              />

              <div className="flex justify-end">
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="w-fit flex items-center gap-2 cursor-pointer text-center bg-[#9e74eb] hover:opacity-90 text-white px-6 py-3 rounded-xl transition duration-300 shadow-md"
                >
                  Close
                </button>
              </div>

            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Confirm AI Analyze Modal */}
      <Transition appear show={confirmAnalyzeOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setConfirmAnalyzeOpen(false)}>
          <Transition.Child
            as={React.Fragment}
            enter=""
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-6">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6">
                <Dialog.Title className="text-2xl font-bold mb-4 text-gray-800">Confirm AI Analysis</Dialog.Title>
                <p className="text-gray-600 mb-6">Are you sure you want to proceed with AI analysis? This may take a few moments.</p>
                <div className="flex justify-end gap-3">
                  <button
                    disabled={aiAnalyze}
                    onClick={() => setConfirmAnalyzeOpen(false)}
                    className="w-fit flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center bg-gray-400 hover:opacity-90 text-white px-6 py-2 rounded-xl transition duration-300 shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={aiAnalyze}
                    onClick={confirmAnalyze}
                    className="w-fit flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center bg-[#9e74eb] hover:opacity-90 text-white px-6 py-2 rounded-xl transition duration-300 shadow-md"
                  >
                    {aiAnalyze ? (
                      <VscLoading className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span className="text-sm">Analyze</span>
                      </>
                    )}
                    </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Optimized Content Modal */}
      <Transition appear show={optimizedContentOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setOptimizedContentOpen(false)}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-6">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl p-6">
                <Dialog.Title className="text-2xl font-bold mb-4 text-center text-gray-800">Optimized Content</Dialog.Title>
                <div
                  className="prose max-w-none prose-blue prose-img:rounded-xl mb-6"
                  dangerouslySetInnerHTML={{ __html: optimizedContent }}
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={copyOptimizedContent}
                    className="w-fit flex items-center gap-2 cursor-pointer text-center bg-[#9e74eb] hover:opacity-90 text-white px-6 py-3 rounded-xl transition duration-300 shadow-md"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => setOptimizedContentOpen(false)}
                    className="w-fit flex items-center gap-2 cursor-pointer text-center bg-gray-400 hover:opacity-90 text-white px-6 py-3 rounded-xl transition duration-300 shadow-md"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Prompt Register Modal */}
      <Transition appear show={promptRegister} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setPromptRegister(false)}>
          <Transition.Child
            as={React.Fragment}
            enter=""
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-6">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl p-6">
                <Dialog.Title className="text-2xl font-bold mb-4 text-center text-gray-800">No Subscription</Dialog.Title>
                <div className="flex justify-center items-center">
                  <p className="text-gray-600 mb-6">You are not subscribed to any plan. Please subscribe to a plan to publish a post.</p>
                </div>
                <div className="flex w-full gap-3">
                  <button
                    onClick={() => navigate("/#plans")}
                    className="w-full gap-2 cursor-pointer text-center bg-[#9e74eb] hover:opacity-90 text-white px-6 py-3 rounded-xl transition duration-300 shadow-md"
                  >
                    Subscribe
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default CreatePost;
