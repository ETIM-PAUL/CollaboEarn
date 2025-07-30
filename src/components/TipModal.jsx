import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import { formatEther } from 'viem';
import { ethers } from 'ethers';
import { coinContract } from './utils';

const TipModal = ({isOpen, onClose, getUserBalance, coinDetails, userCoinBalance }) => {
  const [amount, setAmount] = useState('');
  const [tipping, setTipping] = useState(false);

  const handleTip = async() => {
    const abi = [
      {
        "constant": false,
        "inputs": [
          { "name": "_to", "type": "address" },
          { "name": "_value", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "name": "", "type": "bool" }],
        "type": "function"
      }
    ];

    // Initialize provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Connect to the contract
    const contract = new ethers.Contract(coinDetails.address, abi, signer);

    // Function to send ERC20 tokens
      try {
        setTipping(true);
        // Convert amount to wei (assuming 18 decimals)
        const amountInWei = ethers.utils.parseUnits(amount, 18);

        // Call the transfer function
        const tx = await contract.transfer(coinDetails.creatorAddress, amountInWei);
        console.log('Transaction sent:', tx.hash);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        getUserBalance(coinDetails.address);
        setTipping(false);
        toast.success('Tip sent successfully');
        onClose();
        return receipt;
      } catch (error) {
        setTipping(false);
        console.error('Error sending tokens:', error);
        throw error;
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
                  Tip the Creator
                </Dialog.Title>
                <div className="mt-4">
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    min={0}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                  />
                </div>

                <p className="text-sm mt-4 text-gray-500 mt-1">
                Your balance: {userCoinBalance ? Number(formatEther(userCoinBalance)).toFixed(2) : 0} {coinDetails.symbol}
              </p>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={tipping}
                    className="inline-flex w-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    disabled={amount <= 0 || tipping || amount > (userCoinBalance ? Number(formatEther(userCoinBalance)) : 0)}
                    className="inline-flex w-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer justify-center rounded-md border border-transparent bg-[#9e74eb] px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9e74eb] focus-visible:ring-offset-2"
                    onClick={handleTip}
                  >
                    {tipping ? 'Tipping...' : 'Tip'}
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

export default TipModal;
