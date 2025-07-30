import React from "react";
import EthIcon from "../assets/icons/ethIcon.svg";
import Profile from "../assets/icons/profile.svg";

const NftRowData = ({ ...props }) => {

  return (
    <>
      <tbody className="font-normal text-gray-900">
        <tr>
          <td>
            {" "}
            <div className="flex gap-1 items-center">
              <img
                src={Profile}
                alt=""
                className="w-10 h-10"
              />
              <span
                className={`font-normal text-gray-900`}
              >
                {props.name}
              </span>
            </div>
          </td>
          <td className="flex items-center">
            <img src={EthIcon} alt="" className="mr-1" />
            {props.volume}
          </td>
          <td>{props.change}</td>
          <td>{props.owners}K</td>
          <td className="flex items-center">
            <img src={EthIcon} alt="" className="mr-1" />
            {props.midprice}
          </td>
          <td>{props.items}</td>
        </tr>
      </tbody>
    </>
  );
};
export default NftRowData;
