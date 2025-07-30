import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  CodeBracketIcon, // Tech
  BanknotesIcon, // Finance
  PaintBrushIcon, // Art
  GlobeAltIcon, // Culture
  CubeIcon, // Web3
  PuzzlePieceIcon, // Gaming
  AcademicCapIcon, // Education
  BeakerIcon, // Science
  HeartIcon, // Health
  GlobeAmericasIcon, // Travel
  CakeIcon, // Food
  FilmIcon, // Entertainment
  MusicalNoteIcon, // Music
  PlayIcon, // Movies
  TrophyIcon, // Sports
  BuildingLibraryIcon, // Politics
  ChartBarIcon // Economy
} from '@heroicons/react/24/outline';
import { parseEther, createPublicClient, http, createWalletClient, custom } from 'viem';
import { toast } from 'react-toastify';
import { abi, coinContract } from './utils';
import { base, baseSepolia } from 'viem/chains';
import { useNavigate } from 'react-router-dom';
// Define the enum locally
const SubscriptionTier = {
  Basic: 0,
  Premium: 1
};

const categories = [
  { name: 'Tech', icon: CodeBracketIcon },
  { name: 'Finance', icon: BanknotesIcon },
  { name: 'Art', icon: PaintBrushIcon },
  { name: 'Culture', icon: GlobeAltIcon },
  { name: 'Web3', icon: CubeIcon },
  { name: 'Gaming', icon: PuzzlePieceIcon },
  { name: 'Education', icon: AcademicCapIcon },
  { name: 'Science', icon: BeakerIcon },
  { name: 'Health', icon: HeartIcon },
  { name: 'Travel', icon: GlobeAmericasIcon },
  { name: 'Food', icon: CakeIcon },
  { name: 'Entertainment', icon: FilmIcon },
  { name: 'Music', icon: MusicalNoteIcon },
  { name: 'Movies', icon: PlayIcon },
  { name: 'Sports', icon: TrophyIcon },
  { name: 'Politics', icon: BuildingLibraryIcon },
  { name: 'Economy', icon: ChartBarIcon }
];

const RegisterModal = ({ isOpen, setIsOpen, plan }) => {
  const [username, setUsername] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleCategoryToggle = (categoryName) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(cat => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate subscription amount based on plan
    const subscriptionAmount = plan === 'Basic' ? 
    parseEther('0.0001') :    // 0.0001 ETH for Basic
    parseEther('0.00015');    // 0.00015 ETH for Premium
  
    
    if (!username || selectedCategories.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }


    try {
      setIsRegistering(true);
      setIsPending(true);

       // Initialize the public client
      const publicClient = createPublicClient({
        chain: base,
        transport: http('https://base-mainnet.g.alchemy.com/v2/7Xfj0s3hOk-JwMVZ40Jkgo9OT4vfP2Ul')
      });

      // Get the account first
      const [account] = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      //add check that user balance is greater or equal to subscription amount
      const balance = await publicClient.getBalance({ address: account });
      if (balance < subscriptionAmount) {
        toast.error('Insufficient balance');
        return;
      }

      // Get the wallet client with the account
      const walletClient = await createWalletClient({
        account,
        chain: base,
        transport: custom(window.ethereum)
      });

      setIsPending(false);
      setIsConfirming(true);

      try {
        await publicClient.simulateContract({
          address: coinContract,
          abi: abi,
          functionName: 'registerUser',
          args: [{
            username: username,
            subscription_tier: plan === 'Basic' ? SubscriptionTier.Basic : SubscriptionTier.Premium,
            interests: selectedCategories
          }],
          value: subscriptionAmount,
          account: account
        });
      } catch (simulateError) {
        console.error('Simulation error:', simulateError);
        toast.error(simulateError.shortMessage || 'Transaction simulation failed. Please try again.');
        return;
      }
      
      // Request transaction
      const hash = await walletClient.writeContract({
        address: coinContract,
        abi: abi,
        functionName: 'registerUser',
        args: [{  // Wrap parameters in an object to match the struct
          username: username,
          subscription_tier: plan === 'Basic' ? SubscriptionTier.Basic : SubscriptionTier.Premium,
          interests: selectedCategories
        }],
        value: subscriptionAmount
      });


      // Wait for transaction
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === 'success') {
        toast.success('Registration successful!');
        navigate('/dashboard');
        setIsOpen(false);
        setIsRegistering(false);
        setIsPending(false);
        setIsConfirming(false);
        setUsername('');
        setSelectedCategories([]);
      } else {
        console.log(receipt);
        toast.error('Registration failed. Please try again.');
      }

    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
      setIsPending(false);
      setIsConfirming(false);
    }
  };

  const isLoading = isPending || isConfirming || isRegistering;
  const isDisabled = isLoading;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  Create Your Account
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9e74eb] focus:border-transparent"
                      placeholder="Enter your username"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Select Your Interests
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {categories.map((category) => (
                        <div
                          key={category.name}
                          className={`relative flex items-center p-4 rounded-lg cursor-pointer border-2 transition-all ${
                            selectedCategories.includes(category.name)
                              ? 'border-[#9e74eb] bg-[#f6f2ff]'
                              : 'border-gray-200 hover:border-[#9e74eb] hover:bg-[#f6f2ff]'
                          }`}
                          onClick={() => handleCategoryToggle(category.name)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.name)}
                            onChange={() => handleCategoryToggle(category.name)}
                            className="h-4 w-4 text-[#9e74eb] focus:ring-[#9e74eb] border-gray-300 rounded"
                          />
                          <div className="ml-3 flex items-center">
                            <category.icon className="h-5 w-5 text-gray-600" />
                            <span className="ml-2 text-sm font-medium text-gray-900">
                              {category.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isDisabled}
                      className={`w-full bg-[#9e74eb] text-white px-4 py-3 rounded-lg transition-opacity font-medium
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                    >
                      {(isDisabled) ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          {isPending ? 'Waiting for approval...' : 
                           isConfirming ? 'Confirming transaction...' : 
                           'Registering...'}
                        </div>
                      ) : (
                        'Complete Registration'
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RegisterModal;
