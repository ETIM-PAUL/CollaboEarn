import React, { useState } from "react";
import Profile from "../assets/icons/profile.svg";
import fire from "../assets/icons/fire.svg";
import { CgReadme } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { RiTeamFill } from "react-icons/ri";

const NftCard = ({ ...props }) => {

  const [loved, setLoved] = useState(true);
  const navigate = useNavigate();
  return (
    <div className="py-2 gro mb-4 px-2 bg-white rounded-lg shadow relative">
      <img src={props.nftImg} alt="" className="w-full h-48 object-cover" />
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
      {props.type === "dashboard" && (
      <div className="flex justify-between my-2 items-center"> 
          <div className="flex gap-1 justify-between w-full items-center">
            <div className={props.classType === "collection" ? "hidden" : "flex gap-1 items-center"}>
              <img src={Profile} alt="" className="w-10 h-10" />
              <span className="text-gray-900">{props.username}</span>
            </div>
            <div className="">
              <span className="font-semibold text-sm text-gray-900">{props.nftName.length > 10 ? props.nftName.slice(0, 10) + "..." : props.nftName}</span>
            </div>
          </div>
      </div>
      )}
      {props.type === "collection" && (
      <div className="flex justify-between my-2 items-center"> 
          <div className="flex gap-1 justify-between w-full items-center">
            <div className={"flex gap-1 items-center"}>
              <span className="font-semibold text-sm text-gray-900">{props.nftName.length > 15 ? props.nftName.slice(0, 15) + "..." : props.nftName}</span>
            </div>
            <div className="flex gap-1 items-center">
              <span className="text-gray-900"><RiTeamFill className="w-5 h-5" /></span>
              <span className="text-gray-900">{props.holders}</span>
            </div>
          </div>
      </div>
      )}
      
      {((props.type === "forYou" && props.classType !== "collection") || (props.type === "dashboard")) && (
        <button
          onClick={() => navigate(`/blog_details/${props.address}`)}
          className="w-full bg-[#9e74eb] cursor-pointer hover:opacity-90 text-white p-2 mt-3 flex justify-center gap-2 items-center rounded-lg"
        >
          <CgReadme className="w-5 h-5" />
        <span className="font-semibold">Read More</span>
      </button>
      )}
      {(props.type === "collection") && (
        <button
          onClick={() => navigate(`/blog_details/${props.address}`)}
          className="w-full bg-[#9e74eb] cursor-pointer hover:opacity-90 text-white p-2 mt-3 flex justify-center gap-2 items-center rounded-lg"
        >
          <CgReadme className="w-5 h-5" />
        <span className="font-semibold">View More</span>
      </button>
      )}
    </div>
  );
};

export default NftCard;
