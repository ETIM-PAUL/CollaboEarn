import React, { useState } from "react";
import fire from "../assets/icons/fire.svg";
import { CgReadme } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { MdPeople } from "react-icons/md";

const ThemeCard = ({ ...props }) => {
  const [loved, setLoved] = useState(true);
  const navigate = useNavigate();
  return (
    <div className="py-2 gro mb-4 px-2 bg-white rounded-lg shadow relative">
      <img 
      src={
        props.nftImg.startsWith("ipfs://")
          ? props.nftImg.replace("ipfs://", "https://ipfs.io/ipfs/")
          : props.nftImg
      }
      alt="" className="w-full h-48 object-cover" />
      <img
        src={loved ? props.loved : props.notLoved}
        alt=""
        className="rounded-full cursor-pointer p-2 absolute top-5 right-7 bg-gray-800 bg-opacity-50"
        style={{ width: "30px", height: "30px" }}
        onClick={() => setLoved(!loved)}
      />
      <button
        className="w-1/2 bg-gray-800 bg-opacity-50 text-white p-2 mt-3 absolute top-32 left-5 flex justify-center gap-2 items-center rounded-lg"
      >
        <img src={fire} alt="" />
        <span className="font-semibold">{props.category}</span>
      </button>

      <div className="flex justify-between my-2 items-center"> 
          <div className="flex gap-1 justify-between w-full items-center">
            <div className="flex gap-1 items-center">
              {/* <img src={Profile} alt="" className="w-10 h-10" /> */}
              <span className="text-gray-900">{props.theme}</span>
            </div>

              <div className="w-full flex items-center gap-1 justify-end">
              <span className="font-semibold text-sm text-gray-900"><MdPeople/></span>
              <span className="font-semibold text-sm text-gray-900">{props.collaborators}</span>
              </div>

          </div>
      </div>

        <button
          onClick={() => navigate(`/publish_post/${props.id}`)}
          className="w-full bg-[#9e74eb] cursor-pointer hover:opacity-90 text-white p-2 mt-3 flex justify-center gap-2 items-center rounded-lg"
        >
          <CgReadme className="w-5 h-5" />
        <span className="font-semibold">Collaborate</span>
      </button>
    </div>
  );
};

export default ThemeCard;