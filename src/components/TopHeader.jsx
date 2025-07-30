import React, { useContext } from "react";
import Logo from "../assets/icons/logo.svg";
import DashboardMenu from "../assets/icons/dashboardMob.svg";
import Profile from "../assets/icons/profile.svg";
import DarkDropDown from "../assets/icons/darkDropDown.svg";
import Market from "../assets/icons/market.svg";
import Dashboard from "../assets/icons/dashboard.svg";
import Message from "../assets/icons/messages.svg";
import Setting from "../assets/icons/settings.svg";
import Wallet from "../assets/icons/wallet.svg";
import Col from "../assets/icons/collection.svg";
import MarketDark from "../assets/icons/marketDark.svg";
import DashboardDark from "../assets/icons/dashboardDark.svg";
import MessageDark from "../assets/icons/messagesDark.svg";
import SettingDark from "../assets/icons/settingsDark.svg";
import WalletDark from "../assets/icons/walletDark.svg";
import ColDark from "../assets/icons/collectionDark.svg";
import SideBarItem from "./SideBarItem";
import { useActiveAccount } from "thirdweb/react";
import { PostsContext } from "../context/PostsContext";

const TopHeader = () => {
  const { allUsers } = useContext(PostsContext);
  const activeAccount = useActiveAccount();
  const user = activeAccount?.address ? allUsers.find((user) => user.userAddress.toLowerCase() === activeAccount?.address.toLowerCase()) : null;

  return (
    <nav className="flex flex-wrap items-start py-2 px-3 lg:px-5 bg-[#f6f2ff]">
      {/* Desktop Search Input */}
      <div className="hidden lg:block w-1/2 lg:w-1/2">
        <input
          className="w-full rounded-full px-4 py-2 border focus:outline-none bg-[#9e74eb] hover:opacity-90 text-gray-800 dark:text-gray-200 placeholder:text-gray-500"
          type="text"
          placeholder="Search posts, collections, and more"
          aria-label="Search"
        />
      </div>

      {/* Mobile Menu Left */}
      <div className="flex gap-2 w-1/2 lg:hidden">
        <span className="font-bold text-sm">
          <img src={DashboardMenu} alt="Dashboard Menu" />
        </span>
        <span className="font-bold text-sm text-gray-800 dark:text-gray-100">
          Dashboard
        </span>
      </div>

      {/* Mobile Logo Center */}
      <div className="flex justify-center w-1/2 lg:hidden">
        <span className="font-bold text-sm">
          <img src={Logo} alt="Logo" />
        </span>
      </div>

      {/* Right side actions */}
        {(activeAccount && user?.username) && (
      <div className="flex gap-3 items-center justify-end w-full lg:w-1/2 mt-2 lg:mt-0">
        <div className="flex gap-2 items-center text-black">
          <img
            src={Profile}
            alt="Profile"
            className="w-10 h-10"
          />
          <span className="hidden lg:flex items-center font-medium">
            @{user?.username}
          </span>
          <img src={DarkDropDown} alt="Dropdown" />
        </div>
      </div>
      )}

      {/* Mobile Sidebar */}
      <div className="w-full lg:hidden bg-gray-100 dark:bg-gray-900 mt-4">
        <div className="px-3 mt-2">
          <SideBarItem title="Dashboard" lightIcon={Dashboard} darkIcon={DashboardDark} link="" />
          <SideBarItem title="Market place" lightIcon={Market} darkIcon={MarketDark} link="market-place" />
          <SideBarItem title="My collection" lightIcon={Col} darkIcon={ColDark} link="collection" />
        </div>
        <div className="pt-1 px-3">
          <span className="font-medium text-gray-800 dark:text-gray-200">Profile</span>
          <SideBarItem title="Messages" lightIcon={Message} darkIcon={MessageDark} link="messages" />
          <SideBarItem title="My wallet" lightIcon={Wallet} darkIcon={WalletDark} link="my-wallet" />
          <SideBarItem title="Settings" lightIcon={Setting} darkIcon={SettingDark} link="settings" />
        </div>
      </div>
    </nav>
  );
};

export default TopHeader;
