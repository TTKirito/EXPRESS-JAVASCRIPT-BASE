export const ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "dataId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "ClaimedId",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "lockPercent",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "firstDistributionType",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "firstUnlockRate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "distributionInterval",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "unlockRateEachTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "maxPeriod",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalWithdraw",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "lastWithdraw",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "distributionAddress",
						"type": "address"
					}
				],
				"indexed": true,
				"internalType": "struct DaolaunchTokenMetrics.LockingPeriod[]",
				"name": "lData",
				"type": "tuple[]"
			}
		],
		"name": "UpdateTokenMetrics",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "dataId",
				"type": "uint256"
			}
		],
		"name": "claimForId",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "lockPercent",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "firstDistributionType",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "firstUnlockRate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "distributionInterval",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "unlockRateEachTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "maxPeriod",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalWithdraw",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "lastWithdraw",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "distributionAddress",
						"type": "address"
					}
				],
				"internalType": "struct DaolaunchTokenMetrics.LockingPeriod[]",
				"name": "lData",
				"type": "tuple[]"
			}
		],
		"name": "updateTokenMetrics",
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
		"name": "lockingPeriodInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "lockPercent",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "firstDistributionType",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "firstUnlockRate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "distributionInterval",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "unlockRateEachTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxPeriod",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalWithdraw",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastWithdraw",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "distributionAddress",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
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
			}
		],
		"name": "tokenInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "currentDataId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "currentPercentLock",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "originalBalance",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]