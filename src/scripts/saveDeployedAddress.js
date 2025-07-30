import { ethers } from 'ethers'; 

const privateKey = import.meta.env.VITE_PRIVATE_KEY;
const rpcUrl = import.meta.env.VITE_RPC_URL;

if (!privateKey || !rpcUrl) {
    throw new Error('Missing environment variables. Ensure PRIVATE_KEY and RPC_URL are set.');
  }


export const saveDeployedCoinAddress = async (coinAddress, coinContract, abi) => {
    // Use providers.JsonRpcProvider instead of ethers.JsonRpcProvider
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(coinContract, abi, wallet);
  
    try {
    const tx = await contract.storeCoinDetails(coinAddress);
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error mutating contract:', error);
  }
};
