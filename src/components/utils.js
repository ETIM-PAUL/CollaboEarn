export const formatDate = (dateString) => {
    try {
      const [year, month, day] = dateString.split('T')[0].split('-');
      const date = new Date(year, month - 1, day); // month is 0-based in JS
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

export const groupCoinsByCreator = (coins) => {
  return coins.reduce((acc, coin) => {
    const creator = coin.creatorAddress;
    if (!acc[creator]) {
      acc[creator] = [];
    }
    acc[creator].push(coin);
    return acc;
  }, {});
};

export const plans = [
    {
        title: 'Basic',
        price: '0.0001ETH/month',
        features: ['Post Banner and Text Editor', '20 posts/month', '5000 words/post']
    },
    {
        title: 'Premium',
        price: '0.00015ETH/month',
        features: ['Post Banner, Text Editor, and AI Assistant', 'Unlimited Posts', 'Unlimited words/post']
    }
]

export const coinContract = "0x1CB7160E2Ed02aAFe8Ee98160460BFf4D2caBB31"

export const groupedData = (data, categories) => {
    return data.reduce((acc, coin) => {
    const category = categories[coin.tokenUri];
    if (!acc[category]) {
      acc[category] = {
        posts: 0,
        creators: new Set()
      };
    }
    acc[category].posts += 1;
    acc[category].creators.add(coin.creatorAddress);
    return acc;
  }, {});
}

export const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "admin",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "previous_admin",
                "type": "address"
            }
        ],
        "name": "AdminUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "coin",
                "type": "address"
            }
        ],
        "name": "CoinDetailsStored",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "current_amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "previous_amount",
                "type": "uint256"
            }
        ],
        "name": "CreatorSubscriptionAmountUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "username",
                        "type": "string"
                    },
                    {
                        "internalType": "enum CoinWrite.SubscriptionTier",
                        "name": "subscription_tier",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string[]",
                        "name": "interests",
                        "type": "string[]"
                    },
                    {
                        "internalType": "address",
                        "name": "userAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "last_subscribed_at",
                        "type": "uint256"
                    }
                ],
                "indexed": false,
                "internalType": "struct CoinWrite.User",
                "name": "user",
                "type": "tuple"
            }
        ],
        "name": "UserRegistered",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "BASIC_CREATOR_SUB_AMOUNT",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "PREMIUM_CREATOR_SUB_AMOUNT",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "THIRTY_DAYS_IN_SECONDS",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "all_coins",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "all_users",
        "outputs": [
            {
                "internalType": "string",
                "name": "username",
                "type": "string"
            },
            {
                "internalType": "enum CoinWrite.SubscriptionTier",
                "name": "subscription_tier",
                "type": "uint8"
            },
            {
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "last_subscribed_at",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "checkSubscriptionStatus",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "coin_admin",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "creator_coins",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllCoins",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllUsers",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "username",
                        "type": "string"
                    },
                    {
                        "internalType": "enum CoinWrite.SubscriptionTier",
                        "name": "subscription_tier",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string[]",
                        "name": "interests",
                        "type": "string[]"
                    },
                    {
                        "internalType": "address",
                        "name": "userAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "last_subscribed_at",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct CoinWrite.User[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "creator",
                "type": "address"
            }
        ],
        "name": "getCreatorCoins",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getUserDetails",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "username",
                        "type": "string"
                    },
                    {
                        "internalType": "enum CoinWrite.SubscriptionTier",
                        "name": "subscription_tier",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string[]",
                        "name": "interests",
                        "type": "string[]"
                    },
                    {
                        "internalType": "address",
                        "name": "userAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "last_subscribed_at",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct CoinWrite.User",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "username",
                        "type": "string"
                    },
                    {
                        "internalType": "enum CoinWrite.SubscriptionTier",
                        "name": "subscription_tier",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string[]",
                        "name": "interests",
                        "type": "string[]"
                    }
                ],
                "internalType": "struct CoinWrite.RegisterUserParams",
                "name": "_params",
                "type": "tuple"
            }
        ],
        "name": "registerUser",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "sendEth",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_coinAddress",
                "type": "address"
            }
        ],
        "name": "storeCoinDetails",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_newAdmin",
                "type": "address"
            }
        ],
        "name": "updateAdmin",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "user_details",
        "outputs": [
            {
                "internalType": "string",
                "name": "username",
                "type": "string"
            },
            {
                "internalType": "enum CoinWrite.SubscriptionTier",
                "name": "subscription_tier",
                "type": "uint8"
            },
            {
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "last_subscribed_at",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

export const formatDateMoment = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
  
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval + ' year' + (interval === 1 ? '' : 's') + ' ago';
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval + ' month' + (interval === 1 ? '' : 's') + ' ago';
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + ' day' + (interval === 1 ? '' : 's') + ' ago';
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + ' hour' + (interval === 1 ? '' : 's') + ' ago';
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + ' minute' + (interval === 1 ? '' : 's') + ' ago';
    }
    return Math.floor(seconds) + ' second' + (seconds === 1 ? '' : 's') + ' ago';
  };

