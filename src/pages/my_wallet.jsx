import React, { useContext, useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import TopHeader from '../components/TopHeader'
import { Copy, Wallet, Network, Coins } from "lucide-react";
import { PostsContext } from '../context/PostsContext';
import TransferModal from '../components/TransferModal';
import ProvideLiquidityModal from '../components/ProvideLiquidityModal';
import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import { useDisconnect, useActiveWallet } from "thirdweb/react";
import { useConnectModal } from "thirdweb/react";
import { clientThirdweb } from '../../client';
import { useActiveWalletChain } from "thirdweb/react";
import { etherlinkTestnet } from 'viem/chains';

const MyWallet = () => {
  const { connect } = useConnectModal();
  const activeAccount = useActiveAccount();
  const { disconnect } = useDisconnect();
  const activeChain = useActiveWalletChain();
  const wallet = useActiveWallet();


  const { data: balance, isLoading } = useWalletBalance({
    client:clientThirdweb,
    chain:activeChain,
    address: activeAccount?.address,
  });
  console.log("activeChain", activeChain)


  const handleCopy = () => {
    navigator.clipboard.writeText(address);
  }

  async function handleConnect() {
    const wallet = await connect({ clientThirdweb, chain: etherlinkTestnet, theme:"dark", title: "CollaboEarn - Connect, Collaborate and start earning" });
  }

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  // const handleTransferClick = (coin, balance) => {
  //   setSelectedCoin(coin);
  //   setCoinBalance(balance);
  //   setIsTransferModalOpen(true);
  // };

  // const handleInvestClick = (coin, balance) => {
  //   setSelectedCoin(coin);
  //   setCoinBalance(balance);
  //   setIsProvideLiquidityModalOpen(true);
  // };


  return (
    <div>
      <div className="w-full bg-[#f6f2ff]">
        <div className="flex p-4">
          <SideBar />
          <div className="block w-full lg:w-10/12">
            <TopHeader />
            <div className="p-4">
              <div className="bg-white rounded-xl p-4">
                <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-8">
                  {!activeAccount ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Connect Your Wallet</h2>
                      <button
                        onClick={() => handleConnect()}
                        className="bg-[#9e74eb] cursor-pointer text-white px-8 py-4 rounded-xl hover:opacity-90 transition-all duration-200 flex items-center gap-2"
                      >
                        <Wallet className="w-5 h-5" />
                        Connect Wallet
                      </button>
                    </div>
                  ) : (
                    <div id="wallet-card" className="max-w-4xl mx-auto space-y-6">
                      {/* Wallet Card */}
                      <div className="bg-white shadow-xl rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-600 mb-1 flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-blue-500" /> Connected Wallet
                          </h2>
                          <div className="text-xl font-mono font-bold text-gray-800">{formatAddress(activeAccount?.address)}</div>
                          <button onClick={handleCopy} className="text-sm mt-1 cursor-pointer text-blue-500 hover:underline">Copy</button>
                        </div>

                        <div className="mt-4 md:mt-0 flex flex-col items-end">
                          <h2 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                            <Network className="w-4 h-4 text-indigo-500" /> Network
                          </h2>
                          <div className="text-md font-medium">{activeChain?.name || 'Unknown'}</div>
                          <button 
                            onClick={() => disconnect(wallet)}
                            className="text-sm text-red-500 hover:underline mt-2"
                          >
                            Disconnect
                          </button>
                        </div>
                      </div>

                      {/* Native Token Balance */}
                      <div className="bg-[#9e74eb] p-6 rounded-3xl shadow flex justify-between items-center">
                        <div>
                          <h3 className="text-md font-medium text-black">Your {balance?.symbol} Balance</h3>
                          <div className="text-3xl font-bold text-white mt-1">
                            {balance?.displayValue} {balance?.symbol}
                          </div>
                        </div>
                        <Coins className="w-12 h-12 text-white" />
                      </div>

                      {/* Token Balances */}
                      {/* <div className="bg-white rounded-3xl p-6 shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Other Token Balances</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {coinBalances?.length > 0 && coinBalances.map((token, i) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                              <div className="flex items-center gap-2">
                              <img src={token?.node?.coin?.mediaContent?.previewImage?.medium} alt={token.symbol} className="w-10 h-10 rounded-full mr-4" />
                              
                              <div>
                                <div className="flex items-center gap-1">
                                  <div className="text-lg font-semibold">{Number(formatEther(token?.node?.balance)).toFixed(2)}</div>
                                  <div className="text-sm text-gray-600">{token.node?.coin?.symbol}</div>
                                </div>
                                <div className="text-sm text-gray-600">{token.node?.coin?.name}</div>
                              </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-1">
                                  <button className="text-xs font-semibold bg-[#9e74eb] text-white px-2 py-1 rounded-md" onClick={() => handleTransferClick(token.node?.coin, token.node?.balance)}>Transfer</button>
                                  <button
                                    className="text-xs font-semibold bg-red-500 text-white px-2 py-1 rounded-md"
                                    onClick={() => handleInvestClick(token.node?.coin, token.node?.balance)}
                                  >
                                    Invest
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div> */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        userCoinBalance={coinBalance}
        coinDetails={selectedCoin}
        getUserBalance={getUserBalance}
      /> */}

    </div>
  )
}

export default MyWallet