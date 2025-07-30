import React, { useState } from "react";
import Profile from "../assets/icons/profile.svg";
import fire from "../assets/icons/fire.svg";
import { CgReadme } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { RiCurrencyFill, RiTeamFill } from "react-icons/ri";
import { shortenAddress } from "thirdweb/utils";
import { FaDollarSign } from "react-icons/fa";

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

      <div className="flex justify-between my-2 items-center"> 
          <div className="flex gap-1 justify-between w-full items-center">
            <div className="flex gap-1 items-center">
              <img src={Profile} alt="" className="w-10 h-10" />
              <span className="text-gray-900">{props.theme.length > 10 ? props.theme.slice(0, 10) + "..." : props.theme}</span>
            </div>
            <div className="">
              <span className="font-semibold text-sm text-gray-900">{props.title.length > 10 ? props.title.slice(0, 10) + "..." : props.title}</span>
            </div>
          </div>
      </div>

      <div className="w-full flex items-center gap-1 justify-end">
        <span className="font-semibold text-sm text-gray-900"><RiCurrencyFill/></span>
        <span className="font-semibold text-sm text-gray-900">-</span>
        <span className="font-semibold text-sm text-gray-900">{props.amount} ETH</span>
      </div>

        <button
          onClick={() => navigate(`/blog_details/${props.id}`)}
          className="w-full bg-[#9e74eb] cursor-pointer hover:opacity-90 text-white p-2 mt-3 flex justify-center gap-2 items-center rounded-lg"
        >
          <CgReadme className="w-5 h-5" />
        <span className="font-semibold">View More</span>
      </button>
    </div>
  );
};

export default NftCard;
