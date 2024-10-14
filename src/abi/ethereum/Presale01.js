export const ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_presaleGenerator",
        "type": "address"
      }
    ],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "BUYERS",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "baseDeposited",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "tokensOwed",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lastWithdraw",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalTokenWithdraw",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isWithdrawnBase",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "CALLER",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DAOLAUNCH_DEV",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "GAS_LIMIT",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "transferDAOLaunchFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "listOnUniswap",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "PRESALE_FEE_INFO",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "DAOLAUNCH_BASE_FEE",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "DAOLAUNCH_TOKEN_FEE",
        "type": "uint256"
      },
      {
        "internalType": "address payable",
        "name": "BASE_FEE_ADDRESS",
        "type": "address"
      },
      {
        "internalType": "address payable",
        "name": "TOKEN_FEE_ADDRESS",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "PRESALE_GENERATOR",
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
    "name": "PRESALE_LOCK_FORWARDER",
    "outputs": [
      {
        "internalType": "contract IPresaleLockForwarder",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "PRESALE_SETTINGS",
    "outputs": [
      {
        "internalType": "contract IPresaleSettings",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "STATUS",
    "outputs": [
      {
        "internalType": "bool",
        "name": "WHITELIST_ONLY",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "LIST_ON_UNISWAP",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "IS_TRANSFERED_FEE",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "IS_OWNER_WITHDRAWN",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "IS_TRANSFERED_DAOLAUNCH_FEE",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "TOTAL_BASE_COLLECTED",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "TOTAL_TOKENS_SOLD",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "TOTAL_TOKENS_WITHDRAWN",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "TOTAL_BASE_WITHDRAWN",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "NUM_BUYERS",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "UNI_FACTORY",
    "outputs": [
      {
        "internalType": "contract IUniswapV2Factory",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "VESTING_PERIOD",
    "outputs": [
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
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "WETH",
    "outputs": [
      {
        "internalType": "contract IWETH",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "finalize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "_presaleOwner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_tokenPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_maxEthPerBuyer",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_minEthPerBuyer",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_hardcap",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_softcap",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_liquidityPercent",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_listingRate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_startblock",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_endblock",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_lockPeriod",
        "type": "uint256"
      }
    ],
    "name": "init1",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "_baseToken",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "_presaleToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_DAOLaunchBaseFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_DAOLaunchTokenFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_uniswapListingTime",
        "type": "uint256"
      },
      {
        "internalType": "address payable",
        "name": "_baseFeeAddress",
        "type": "address"
      },
      {
        "internalType": "address payable",
        "name": "_tokenFeeAddress",
        "type": "address"
      }
    ],
    "name": "init2",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "is_white_list",
        "type": "bool"
      },
      {
        "internalType": "address payable",
        "name": "_caller",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_firstDistributionType",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_firstUnlockRate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_distributionInterval",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_unlockRateEachTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_maxPeriod",
        "type": "uint256"
      }
    ],
    "name": "init3",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "listOnUniswap",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ownerRefundTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ownerWithdrawTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "presaleStatus",
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
    "name": "sendDAOLaunchFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "_flag",
        "type": "bool"
      }
    ],
    "name": "setWhitelistFlag",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_startBlock",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_endBlock",
        "type": "uint256"
      }
    ],
    "name": "updateBlocks",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_transferDAOLaunchFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_listOnUniswap",
        "type": "uint256"
      }
    ],
    "name": "updateGasLimit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_maxSpend",
        "type": "uint256"
      }
    ],
    "name": "updateMaxSpendLimit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "_v",
        "type": "uint8"
      },
      {
        "internalType": "bytes32",
        "name": "_r",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "_s",
        "type": "bytes32"
      }
    ],
    "name": "userDeposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "userWithdrawBaseTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "userWithdrawTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
