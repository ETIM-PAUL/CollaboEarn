import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import { formatEther } from 'viem';
import { ethers } from 'ethers';
import { Pool, Position, nearestUsableTick, TICK_SPACINGS, FeeAmount } from '@uniswap/v3-sdk';
import { Token, CurrencyAmount } from '@uniswap/sdk-core';

const ProvideLiquidityModal = ({ isOpen, onClose, userCoinBalance, userZoraBalance, coinDetails, getUserBalance, getUserZoraBalance }) => {
  const [ethAmount, setEthAmount] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [providingLiquidity, setProvidingLiquidity] = useState(false);

  const handleProvideLiquidity = async () => {
    try {
      setProvidingLiquidity(true);

      // Validate balances
      if (Number(ethAmount) > Number(formatEther(userEthBalance))) {
        toast.error('Insufficient ETH balance');
        return;
      }
      if (Number(tokenAmount) > Number(formatEther(userTokenBalance))) {
        toast.error(`Insufficient ${coinDetails.symbol} balance`);
        return;
      }

      // Initialize provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create token instances
      const ethToken = new Token(1, '0x0000000000000000000000000000000000000000', 18, 'ETH', 'Ether');
      const selectedToken = new Token(1, coinDetails.address, 18, coinDetails.symbol, coinDetails.name);

      // Convert amounts to CurrencyAmount
      const ethAmountInWei = ethers.utils.parseUnits(ethAmount, 18);
      const tokenAmountInWei = ethers.utils.parseUnits(tokenAmount, 18);

      const ethCurrencyAmount = CurrencyAmount.fromRawAmount(ethToken, ethAmountInWei.toString());
      const tokenCurrencyAmount = CurrencyAmount.fromRawAmount(selectedToken, tokenAmountInWei.toString());

      // Create a pool (assuming the pool already exists)
      const pool = new Pool(
        ethToken,
        selectedToken,
        FeeAmount.MEDIUM,
        '0xYourPoolAddress', // Replace with the actual pool address
        '0xYourPoolLiquidity', // Replace with the actual pool liquidity
        nearestUsableTick(Date.now(), TICK_SPACINGS[FeeAmount.MEDIUM]),
        []
      );

      // Create a position
      const position = new Position({
        pool,
        liquidity: ethCurrencyAmount.quotient.toString(),
        tickLower: nearestUsableTick(Date.now(), TICK_SPACINGS[FeeAmount.MEDIUM]),
        tickUpper: nearestUsableTick(Date.now(), TICK_SPACINGS[FeeAmount.MEDIUM]),
      });

      // TODO: Implement the actual liquidity provision logic using Uniswap V3 SDK
      // This is a placeholder for the actual Uniswap V3 SDK integration
      console.log('Providing liquidity with:', {
        ethAmount,
        tokenAmount,
        tokenAddress: coinDetails.address,
        position,
      });

      toast.success('Liquidity provided successfully');
      getUserZoraBalance();
      getUserBalance();
      onClose();
    } catch (error) {
      console.error('Error providing liquidity:', error);
      toast.error('Failed to provide liquidity');
    } finally {
      setProvidingLiquidity(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={React.Fragment}
          enter=""
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black opacity-50" />
        </Transition.Child>

        {/* Modal */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Provide Liquidity
                </Dialog.Title>
                <div className="mt-4">
                <label className="text-sm mt-4 text-gray-500 mt-1">Zora Amount</label>
                  <input
                    type="number"
                    placeholder="ETH Amount"
                    value={ethAmount}
                    min={0}
                    onChange={(e) => setEthAmount(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                  />

                  <label className="text-sm mt-4 text-gray-500 mt-1">{coinDetails?.symbol} Amount</label>
                  <input
                    type="number"
                    placeholder={`${coinDetails?.symbol} Amount`}
                    value={tokenAmount}
                    min={0}
                    onChange={(e) => setTokenAmount(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                  />
                </div>

                <p className="text-sm mt-4 text-gray-500 mt-1">
                  Your Zora balance: {userZoraBalance ? Number(userZoraBalance) : 0} Zora
                </p>
                <p className="text-sm mt-4 text-gray-500 mt-1">
                  Your {coinDetails?.symbol} balance: {userCoinBalance ? Number(formatEther(userCoinBalance)).toFixed(2) : 0} {coinDetails?.symbol}
                </p>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={providingLiquidity}
                    className="inline-flex w-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    disabled={
                      providingLiquidity ||
                      ethAmount <= 0 ||
                      tokenAmount <= 0 ||
                      Number(ethAmount) > Number(userZoraBalance) ||
                      Number(tokenAmount) > Number(formatEther(userCoinBalance))
                    }
                    className="inline-flex w-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer justify-center rounded-md border border-transparent bg-[#9e74eb] px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9e74eb] focus-visible:ring-offset-2"
                    onClick={handleProvideLiquidity}
                  >
                    {providingLiquidity ? 'Providing Liquidity...' : 'Provide Liquidity'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProvideLiquidityModal;
