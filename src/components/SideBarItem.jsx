import React from "react";
import { NavLink } from "react-router-dom";

const SideBarItem = ({ title, lightIcon, darkIcon, link }) => {
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        `flex items-center gap-3 p-2 my-2 rounded-lg ${
          isActive ? "bg-[#9e74eb] hover:opacity-90 text-white" : "text-gray-400 hover:text-white hover:bg-[#9e74eb] hover:opacity-90"
        }`
      }
    >
      <img src={lightIcon} alt={title} className="w-6 h-6" />
      <span className="font-medium">{title}</span>
    </NavLink>
  );
};

export default SideBarItem;
