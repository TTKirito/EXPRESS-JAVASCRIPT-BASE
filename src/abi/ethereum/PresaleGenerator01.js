export const ABI = [
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
    "inputs": [],
    "name": "PRESALE_FACTORY",
    "outputs": [
      {
        "internalType": "contract IPresaleFactory",
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
    "inputs": [
      {
        "internalType": "address payable",
        "name": "_presaleOwner",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "_presaleToken",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "_baseToken",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "is_white_list",
        "type": "bool"
      },
      {
        "internalType": "uint256[12]",
        "name": "uint_params",
        "type": "uint256[12]"
      },
      {
        "internalType": "address payable",
        "name": "_caller",
        "type": "address"
      },
      {
        "internalType": "uint256[5]",
        "name": "_vestingPeriod",
        "type": "uint256[5]"
      }
    ],
    "name": "createPresale",
    "outputs": [],
    "stateMutability": "payable",
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
  }
]
