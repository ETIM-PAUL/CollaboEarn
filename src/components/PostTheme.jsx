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
import { abi, coinContract, contractAddress } from "./utils";
import { PostsContext } from "../context/PostsContext";
import { ethers } from "ethers";
import { useActiveAccount } from "thirdweb/react";
const categories = [
  "Tech", "Finance", "Art", "Culture", "Web3", "Gaming", "Education",
  "Science","Health", "Travel","Food", "Entertainment", "Music",
  "Movies", "Sports", "Politics", "Economy"
];
const types = [
  "clips", "artworks", "words"
];

const CreateThemePage = () => {
  const [name, setName] = useState("");
  const [banner, setBanner] = useState(null);
  const [category, setCategory] = useState(null);
  const [type, setType] = useState(null);
  const [maxCollaborators, setMaxCollaborators] = useState(1);
  const [description, setDescription] = useState("");
  const [creatingTheme, setCreatingTheme] = useState(false);
  const activeAccount = useActiveAccount()
  const navigate = useNavigate()

  
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
      return data
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      throw error;
    }
  }

  const publishTheme = async(filename = "metadata.json") => {
    if (!name || !description || !banner || !category) {
      toast.error("Please fill in all fields");
      return;
    }

    setCreatingTheme(true);

    try {
      // Upload banner image to IPFS
      const imageUrl = await uploadImageToIPFS(banner);
      
      // Upload content to IPFS
      const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

      // Create metadata JSON
      const metadata = {
        theme:name,
        description,
        image: "ipfs://" + imageUrl.IpfsHash,
        type:type,
        category:category
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

        // Interact with contract here
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.createTheme(
          contentUrl,
          type,
          maxCollaborators
        );
        await tx.wait();
        toast.success("Theme created on-chain!");
        navigate("/themes")
        setCreatingTheme(false);

      } else {
        throw new Error("IPFS upload failed.");
      }

      //interact with a contract function here

    } catch (error) {
      console.error("Error creating theme:", error);
      toast.error("Failed to create theme");
      setCreatingTheme(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-10 px-6 md:px-16">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 space-y-6">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center">Create New Theme</h1>

        {/* Title Input */}
        <label className="block text-sm font-medium text-gray-600">Theme Title</label>
        <input
          type="text"
          placeholder="Enter theme title"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />


        {/* Banner Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-600">Theme Banner Image</label>
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

        <div>
          <label className="block text-sm font-medium text-gray-600">Theme Category</label>
          <select
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            <option>--select category--</option>
            {categories.map((cat,index) =>
            <option value={cat} key={index}>{cat}</option>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Theme Type</label>
          <select
          value={type}
          onChange={(e)=>setType(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            <option>--select type--</option>
            {types.map((type,index) =>
            <option value={type} key={index}>{type.toUpperCase()}</option>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Theme Max Collaborators</label>
          <input
          type="number"
          placeholder="Enter theme max collaborators"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          value={maxCollaborators}
          onChange={(e) => setMaxCollaborators(e.target.value)}
        />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Theme Description</label>
          <textarea 
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            rows={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>

        <div className="flex justify-end gap-2">
              <button
                disabled={creatingTheme}
                onClick={() => publishTheme()}
                className="w-fit flex items-center gap-2 cursor-pointer text-center bg-[#9e74eb] hover:opacity-90 text-white px-6 py-3 rounded-xl transition duration-300 shadow-md"
              >
                {creatingTheme ? (
                  <VscLoading className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span className="text-sm">Create</span>
                    <PlusIcon className="w-5 h-5" />
                  </>
                )}
                </button>
        </div>

      </div>

    </div>
  );
};

export default CreateThemePage;