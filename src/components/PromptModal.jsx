import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import darkMarket from "../assets/icons/darkMarket.svg";

const PurchaseModal = ({ isOpen, onClose, loading, setLoading, heading, description, handleAction, type, amount, setAmount }) => {

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
                  {heading}
                </Dialog.Title>

                <Dialog.Description className="text-sm text-red-500 mt-2">
                    {description}
                </Dialog.Description>

                {type === "forSale" && (
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
                )}
                <div className="mt-10 flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={loading}
                    className="inline-flex w-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    className="inline-flex w-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer justify-center rounded-md border border-transparent bg-[#9e74eb] gap-2 px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9e74eb] focus-visible:ring-offset-2"
                    onClick={handleAction}
                  >
                    {loading ? 'Processing...' : 'Proceed'}
                    {type === "purchase" && (
                      <img src={darkMarket} alt="" className="w-5 h-5" />
                    )}
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

export default PurchaseModal;
