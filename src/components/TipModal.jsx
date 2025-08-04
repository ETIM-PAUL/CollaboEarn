import React, { useState, useEffect, useContext } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import { formatEther } from 'viem';
import { ethers } from 'ethers';
import { abi, coinContract, contractAddress } from './utils';
import { PostsContext } from '../context/PostsContext';

const TipModal = ({post, isOpen, onClose, userCoinBalance }) => {
  const [amount, setAmount] = useState('');
  const [tipping, setTipping] = useState(false);
  const { setAllThemes } = useContext(PostsContext);


  async function getThemeInfo(link) {
    const url = link;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  const getAllThemes = async () => {
    try {
      // Initialize provider and contract
      const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
      const contract = new ethers.Contract(contractAddress, abi, provider);

      // Call the getAllThemes function
      const allThemes = await contract.getAllThemes();

      // Map each theme to a promise that resolves to the formatted object
      const formattedThemes = await Promise.all(
        allThemes.map(async (element) => {
          const res = await getThemeInfo(element?.ipfsUrl);
          return {
            id: BigNumber.from(element?.id._hex).toString(),
            nftImg: res?.image,
            theme: res?.theme,
            description: res?.description,
            amount: BigNumber.from(element?.tips._hex).toString(),
            creator: element?.creator,
            category: res?.category,
            type: element?.contentType,
            collaborators: BigNumber.from(element?.collaborators._hex).toString(),
            maxCollaborators: BigNumber.from(element?.maxCollaborators._hex).toString(),
            date: BigNumber.from(element?.dateCreated._hex).toString(),
          };
        })
      );

      setAllThemes(formattedThemes);

    } catch (error) {
      console.error('Error fetching coin addresses:', error);
      throw error;
    }
  };

  const handleTip = async() => {
     // Request wallet connection
     await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Initialize provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Connect to the contract
    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Function to send ERC20 tokens
      try {
        setTipping(true);
        // Call the transfer function
        const tx = await contract.tipTheme(post?.theme, {
          value: ethers.utils.parseEther(amount)
        });
        console.log('Transaction sent:', tx.hash);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        setTipping(false);
        getAllThemes();
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
                  Tip the Collaborators
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
                Your balance: {userCoinBalance ? userCoinBalance : 0} {"XTZ"}
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
