import React, { useState } from "react";
import { createTradeCall } from "@zoralabs/coins-sdk";
import { formatEther, parseEther } from "ethers/lib/utils";
import { createWalletClient, custom, http } from "viem";
import { base } from "viem/chains";
import { toast } from "react-toastify";
export default function EthModal({ ethBalance, userCoinBalance, setLoading, onClose, loading, erc20Address, address, coinDetails }) {
  const [tab, setTab] = useState("BUY");
  const [amount, setAmount] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    setAmount(e.target.value);
  };

  const isDisabled = parseFloat(amount) > parseFloat(ethBalance);
  async function tradeCoins(type) {
    if(amount <= 0) {
      toast.error("Amount cannot be 0");
      return;
    }
    setLoading(true);
    let tradeParameters;
    if(type === "BUY") {
     tradeParameters = {
        sell: { type: "eth" },
        buy: {
          type: "erc20",
          address: erc20Address, // Creator coin address
        },
        amountIn: parseEther(amount.toString()), // 0.001 ETH
        slippage: 0.05, // 5% slippage tolerance
        sender: address,
      };
    } else {
        tradeParameters = {
            sell: { 
              type: "erc20", 
              address: erc20Address // Creator coin address
            },
            buy: { type: "eth" },
            amountIn: parseEther(amount.toString()), // 100 tokens (adjust decimals as needed)
            slippage: 0.15, // 15% slippage tolerance
            sender: address,
         };
       }

       try {
           // Get trade call data without executing
            const quote = await createTradeCall(tradeParameters);
            
            const walletClient = createWalletClient({
              account: address,
              chain: base,
              transport: custom(window.ethereum)
            });
            
            // Execute the call directly
            const tx = await walletClient.sendTransaction({
            to: quote.call.target,
            data: quote.call.data,
            value: BigInt(quote.call.value),
            account: address,
            });
    
            if(tx) {
              toast.success("Transaction successful");
              setLoading(false);
              onClose();
            }
       } catch (error) {
        console.log(error);
        toast.error("Transaction failed");
        setLoading(false);
       }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <div className="flex justify-between mb-4">
          <button
            className={`flex-1 py-2 font-semibold ${
              tab === "BUY" ? "bg-[#9e74eb] text-white" : "bg-gray-100"
            }`}
            onClick={() => setTab("BUY")}
          >
            BUY
          </button>
          <button
            className={`flex-1 py-2 font-semibold ${
              tab === "SELL" ? "bg-red-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => setTab("SELL")}
          >
            SELL
          </button>
        </div>

        <div className="mb-4">
          {tab === "BUY" && (
          <label className="block text-sm mb-1 font-medium">Amount in ETH</label>
          )}
          {tab === "SELL" && (
            <label className="block text-sm mb-1 font-medium">Amount in {coinDetails.symbol}</label>
          )}
          <input
            type="number"
            value={amount}
            onChange={handleChange}
            placeholder="0.0"
            className="w-full border px-4 py-2 rounded-lg"
          />
          {tab === "BUY" && (
          <p className="text-sm mt-4 text-gray-500 mt-1">
            Your balance: {ethBalance} ETH
          </p>
          )}
          {tab === "SELL" && (
            <p className="text-sm mt-4 text-gray-500 mt-1">
              Your balance: {userCoinBalance ? Number(formatEther(userCoinBalance)).toFixed(2) : 0} {coinDetails.symbol}
            </p>
          )}    
        </div>

        <div className="flex justify-between gap-4 mt-8">
            <button
            disabled={loading}
            onClick={onClose}
            className={`w-full cursor-pointer py-2 rounded-lg font-semibold text-black bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
            Close
            </button>
            <button
            disabled={isDisabled}
            onClick={() => tradeCoins(tab)}
            className={`w-full cursor-pointer py-2 rounded-lg font-semibold ${
                tab === "BUY"
                ? "bg-[#9e74eb] text-white"
                : "bg-red-500 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
            {loading ? "Processing..." : tab === "BUY" ? "Purchase " + coinDetails.symbol : "Sell " + coinDetails.symbol}
            </button>

        </div>

      </div>
    </div>
  );
}
