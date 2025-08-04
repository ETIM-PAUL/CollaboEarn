export const formatDate = (timestamp) => {
    if (!timestamp) return "";
    // If timestamp is a string, convert to number
    const ts = Number(timestamp);
    // Convert seconds to milliseconds
    const date = new Date(ts * 1000);
    // Format as YYYY-MM-DD
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
export const contractAddress = "0xF77025Db69882AD1c7f18D2A1C5B8821C091916C"

export const ipfsToHttp = (ipfsUrl) => ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');

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
                "indexed": true,
                "internalType": "address",
                "name": "admin",
                "type": "address"
            }
        ],
        "name": "AdminAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "contributionId",
                "type": "uint256"
            }
        ],
        "name": "ContributionApproved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "contributionId",
                "type": "uint256"
            }
        ],
        "name": "ContributionRevoked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "contributionId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "themeId",
                "type": "uint256"
            }
        ],
        "name": "ContributionSubmitted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "themeId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "creator",
                "type": "address"
            }
        ],
        "name": "ThemeCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "themeId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "perContributor",
                "type": "uint256"
            }
        ],
        "name": "TipReceived",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "admin",
                "type": "address"
            }
        ],
        "name": "addAdmin",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "contributionId",
                "type": "uint256"
            }
        ],
        "name": "approveContribution",
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
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "collaboratorThemeEarnings",
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
                "name": "themeId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "ipfsLink",
                "type": "string"
            }
        ],
        "name": "contribute",
        "outputs": [],
        "stateMutability": "nonpayable",
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
        "name": "contributions",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "themeId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "dateCreated",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "ipfsLink",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "ipfsUrl",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "contentType",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "maxCollaborators",
                "type": "uint256"
            }
        ],
        "name": "createTheme",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllContributions",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "themeId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "dateCreated",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "ipfsLink",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "approved",
                        "type": "bool"
                    }
                ],
                "internalType": "struct CollabContentPlatform.Contribution[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllThemes",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "ipfsUrl",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tips",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "contentType",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "dateCreated",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "collaborators",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "maxCollaborators",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address[]",
                        "name": "allCollaborators",
                        "type": "address[]"
                    }
                ],
                "internalType": "struct CollabContentPlatform.Theme[]",
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
                "internalType": "uint256",
                "name": "themeId",
                "type": "uint256"
            }
        ],
        "name": "getCollaborators",
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
        "name": "getUserContributions",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "themeId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "dateCreated",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "ipfsLink",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "approved",
                        "type": "bool"
                    }
                ],
                "internalType": "struct CollabContentPlatform.Contribution[]",
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
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "themeId",
                "type": "uint256"
            }
        ],
        "name": "getUserThemeEarnings",
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
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "isAdmin",
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
        "name": "nextContributionId",
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
        "name": "nextThemeId",
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
                "name": "contributionId",
                "type": "uint256"
            }
        ],
        "name": "revokeContribution",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "superadmin",
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
        "name": "themes",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "ipfsUrl",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tips",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "contentType",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "dateCreated",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "collaborators",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "maxCollaborators",
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
                "name": "themeId",
                "type": "uint256"
            }
        ],
        "name": "tipTheme",
        "outputs": [],
        "stateMutability": "payable",
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

