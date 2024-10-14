import networkKeys from '../utils/network';

const getNetworkKey = (key) => {
  return networkKeys[process.env.NODE_ENV || 'LCL'][key];
};

const LISTING_RATE_LIMIT = {
  MIN: 1,
  MAX: 3,
};

const INITIAL_LIQUIDITY_PERIOD_LIMIT = {
  MIN: 30,
  MAX: 100,
};

const LOCK_LIQUIDITY = {
  ONE_MONTH: "ONE_MONTH",
  TWO_MONTHS: "TWO_MONTHS",
  THREE_MONTHS: "THREE_MONTHS",
  SIX_MONTHS: "SIX_MONTHS",
  ONE_YEAR: "ONE_YEAR",
  TWO_YEARS: "TWO_YEARS",
};

const CURRENCIES = {
  ETH: {
    ETH: "ETH",
    USDT: "USDT",
  },
  BSC: {
    BNB: "BNB",
    BUSD: "BUSD",
  },
};

const NETWORK_LIST = [
  {
    NAME: "Binance Smart Chain Mainnet",
    CHAIN_ID: 56,
    SHORTNAME: "bnb",
    CHAIN: "BSC",
    NETWORK: "mainnet",
    NETWORK_ID: 56,
    API_URL: getNetworkKey('NETWORK_56_API_URL'),
    NODE_RPC: getNetworkKey('NETWORK_56_NODE_RPC'),
  },
  {
    NAME: "Binance Smart Chain Testnet",
    CHAIN_ID: 97,
    SHORTNAME: "bnbt",
    CHAIN: "BSC",
    NETWORK: "testnet",
    NETWORK_ID: 97,
    API_URL: getNetworkKey('NETWORK_97_API_URL'),
    NODE_RPC: getNetworkKey('NETWORK_97_NODE_RPC'),
  },
  {
    NAME: "Ethereum Mainnet",
    CHAIN_ID: 1,
    SHORTNAME: "eth",
    CHAIN: "ETH",
    NETWORK: "mainnet",
    NETWORK_ID: 1,
    API_URL: getNetworkKey('NETWORK_1_API_URL'),
    NODE_RPC: getNetworkKey('NETWORK_1_NODE_RPC'),
  },
  {
    NAME: "Ethereum Testnet Ropsten",
    CHAIN_ID: 3,
    SHORTNAME: "rop",
    CHAIN: "ETH",
    NETWORK: "ropsten",
    NETWORK_ID: 3,
    API_URL: getNetworkKey('NETWORK_3_API_URL'),
    NODE_RPC: getNetworkKey('NETWORK_3_NODE_RPC'),
  },
  {
    NAME: "Ethereum Testnet Rinkeby",
    CHAIN_ID: 4,
    SHORTNAME: "rin",
    CHAIN: "ETH",
    NETWORK: "rinkeby",
    NETWORK_ID: 4,
    API_URL: getNetworkKey('NETWORK_4_API_URL'),
    NODE_RPC: getNetworkKey('NETWORK_4_NODE_RPC'),
  },
  {
    NAME: "Ethereum Testnet Kovan",
    CHAIN_ID: 42,
    SHORTNAME: "kov",
    CHAIN: "ETH",
    NETWORK: "kovan",
    NETWORK_ID: 42,
    API_URL: getNetworkKey('NETWORK_42_API_URL'),
    NODE_RPC: getNetworkKey('NETWORK_42_NODE_RPC'),
  },
  {
    NAME: "Ethereum Goerli",
    CHAIN_ID: 5,
    CHAIN: "ETH",
    NETWORK_ID: 5,
    API_URL: getNetworkKey('NETWORK_5_API_URL'),
    NODE_RPC: getNetworkKey('NETWORK_5_NODE_RPC'),
  },
  {
    NAME: "Arbitrum Testnet",
    CHAIN_ID: 421611,
    CHAIN: "AETH",
    NETWORK_ID: 421611,
    API_URL: getNetworkKey('NETWORK_421611_API_URL'),
    NODE_RPC: getNetworkKey('NETWORK_421611_NODE_RPC'),
  },
  {
    NAME: "Arbitrum One",
    CHAIN_ID: 42161,
    CHAIN: "AETH",
    NETWORK_ID: 42161,
    API_URL: getNetworkKey('NETWORK_42161_API_URL'),
    NODE_RPC: getNetworkKey('NETWORK_42161_NODE_RPC'),
  },
];

const NETWORK_ID_LIST = {
  BSC_MAINNET: 56,
  BSC_TESTNET: 97,
  ETH: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  KOVAN: 42,
  GOERLI: 5,
  ARB_TESTNET: 421611,
  ARB_MAINNET: 42161,
};

const EXCHANGE_LIST = {
  UNISWAP: "Uniswap",
  PANCAKESWAP: "Pancakeswap",
};

const CONTRACT_ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address",
      },
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
];

const PROVIDERS = {
  1: getNetworkKey('PROVIDER_1'),
  3: getNetworkKey('PROVIDER_3'),
  4: getNetworkKey('PROVIDER_4'),
  5: getNetworkKey('PROVIDER_5'),
  42: getNetworkKey('PROVIDER_42'),
  56: getNetworkKey('PROVIDER_56'),
  97: getNetworkKey('PROVIDER_97'),
  42161: getNetworkKey('PROVIDER_42161'),
  421611: getNetworkKey('PROVIDER_421611'),
};

const CURRENCY = {
  1: {
    ETH: getNetworkKey('CURRENCY_1_ETH'),
    USDT: getNetworkKey('CURRENCY_1_USDT'),
  },
  4: {
    ETH: getNetworkKey('CURRENCY_4_ETH'),
    USDT: getNetworkKey('CURRENCY_4_USDT'),
  },
  42: {
    ETH: getNetworkKey('CURRENCY_42_ETH'),
    USDT: getNetworkKey('CURRENCY_42_USDT'),
  },
  97: {
    BNB: getNetworkKey('CURRENCY_97_BNB'),
    BUSD: getNetworkKey('CURRENCY_97_BUSD'),
  },
  56: {
    BNB: getNetworkKey('CURRENCY_56_BNB'),
    BUSD: getNetworkKey('CURRENCY_56_BUSD'),
  },
  42161: {

  },
  421611: {

  },
};

const UNISWAP = {
  1: getNetworkKey('UNISWAP_1'),
  4: getNetworkKey('UNISWAP_4'),
  42: getNetworkKey('UNISWAP_42'),
  56: getNetworkKey('UNISWAP_56'),
  97: getNetworkKey('UNISWAP_97'),
  42161: '',
  421611: '',
};

const UNISWAP_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_feeToSetter", type: "address" },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token0",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token1",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "pair",
        type: "address",
      },
      { indexed: false, internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "PairCreated",
    type: "event",
  },
  {
    constant: true,
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "allPairs",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "allPairsLength",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "tokenA", type: "address" },
      { internalType: "address", name: "tokenB", type: "address" },
    ],
    name: "createPair",
    outputs: [{ internalType: "address", name: "pair", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "feeTo",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "feeToSetter",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "getPair",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "_feeTo", type: "address" }],
    name: "setFeeTo",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "_feeToSetter", type: "address" },
    ],
    name: "setFeeToSetter",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];
const USDT_ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "_upgradedAddress", type: "address" }],
    name: "deprecate",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "deprecated",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "_evilUser", type: "address" }],
    name: "addBlackList",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "upgradedAddress",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "balances",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "maximumFee",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "unpause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_maker", type: "address" }],
    name: "getBlackListStatus",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "address" },
    ],
    name: "allowed",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "paused",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "who", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "pause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getOwner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "newBasisPoints", type: "uint256" },
      { name: "newMaxFee", type: "uint256" },
    ],
    name: "setParams",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "amount", type: "uint256" }],
    name: "issue",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "amount", type: "uint256" }],
    name: "redeem",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "remaining", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "basisPointsRate",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "isBlackListed",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "_clearedUser", type: "address" }],
    name: "removeBlackList",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "MAX_UINT",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "_blackListedUser", type: "address" }],
    name: "destroyBlackFunds",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "_initialSupply", type: "uint256" },
      { name: "_name", type: "string" },
      { name: "_symbol", type: "string" },
      { name: "_decimals", type: "uint256" },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "amount", type: "uint256" }],
    name: "Issue",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "amount", type: "uint256" }],
    name: "Redeem",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "newAddress", type: "address" }],
    name: "Deprecate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "feeBasisPoints", type: "uint256" },
      { indexed: false, name: "maxFee", type: "uint256" },
    ],
    name: "Params",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "_blackListedUser", type: "address" },
      { indexed: false, name: "_balance", type: "uint256" },
    ],
    name: "DestroyedBlackFunds",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "_user", type: "address" }],
    name: "AddedBlackList",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "_user", type: "address" }],
    name: "RemovedBlackList",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "spender", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "Pause", type: "event" },
  { anonymous: false, inputs: [], name: "Unpause", type: "event" },
];

const BUSD_ABI = [
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    constant: true,
    inputs: [],
    name: "_decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "burn",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "subtractedValue", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "mint",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];
const PANCAKE_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_feeToSetter", type: "address" },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token0",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token1",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "pair",
        type: "address",
      },
      { indexed: false, internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "PairCreated",
    type: "event",
  },
  {
    constant: true,
    inputs: [],
    name: "INIT_CODE_PAIR_HASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "allPairs",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "allPairsLength",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "tokenA", type: "address" },
      { internalType: "address", name: "tokenB", type: "address" },
    ],
    name: "createPair",
    outputs: [{ internalType: "address", name: "pair", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "feeTo",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "feeToSetter",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "getPair",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "_feeTo", type: "address" }],
    name: "setFeeTo",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "_feeToSetter", type: "address" },
    ],
    name: "setFeeToSetter",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const DAOLAUNCH_FEE = {
  1: getNetworkKey('DAOLAUNCH_FEE_1'), // 0.5 eth
  3: getNetworkKey('DAOLAUNCH_FEE_3'), // 0.3 eth
  4: getNetworkKey('DAOLAUNCH_FEE_4'), // 0.3 eth
  5: getNetworkKey('DAOLAUNCH_FEE_5'), // 0.3 eth
  42: getNetworkKey('DAOLAUNCH_FEE_42'), // 0.3 eth
  56: getNetworkKey('DAOLAUNCH_FEE_56'), // 0.1 bnb
  97: getNetworkKey('DAOLAUNCH_FEE_97'), // 0.1 bnb
  42161: '',
  421611: '',
};

const PAYMENT_CURRENCIES = {
  ETH: 'ETH',
  BNB: 'BNB',
  USDT: 'USDT',
  BUSD: 'BUSD',
};

const NOT_LISTED_UNISWAP_DATA_RESULT = '0x0000000000000000000000000000000000000000';

// const ADMIN_WALLETS = [
//   "0xfaa08724e0564fa59a517a1db8c5856a99226445",
//   "0x20944bb791e4f7ac57f38e110ae50d1e7aab826c",
//   "0x68d4c1ca4bed732d2bec9eea732859c60c95a51b",
//   "0x2118b575523e8c37a7995b63861914a56607ccbd",
//   "0xbed006764efe5479f3037afa0c2ee612eff2f735",
//   "0x083472030626b27e5f81761ea7b44a08e32bc7a2",
//   "0x1d7b68283e672e45a5a282311c42034401e6500e",
//   "0x96b18a23114003902c7ee6b998037acbd1b4332b",
// ];

const UNISWAP_ROUTERS = {
  1: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  3: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  4: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  42: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  56: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
  97: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1',
  42161: '',
  421611: '',
}

const UNISWAP_LOCKERS = {
  1: '0x1eAfB71233164315E1eEf46c9b636861C2732801',
  3: '',
  4: '0x23E9C995E14d846b520e0A1dDba5433C8baFcF69',
  42: '0x44d96712044980eA7f679c26A4C24e5947e810C3',
  56: '0xD62b8296E293EA793f8bAB4407FD8B67D8Fd6aCA',
  97: '0xAd4a9168182f1Aa7a80240298dA565af197a2cd3',
  42161: '',
  421611: '',
}

const TOKEN_DAL_ADDRESS = {
  1: '',
  3: '',
  4: '0x3E7fb9668e145DA12Ddb22Ca50892C3241bc9A1C',
  5: '',
  42: '',
  56: '',
  97: '0x7A219E56eD50C4aEFE5FdbD1688B5c010b52D4Cf',
  42161: '',
  421611: '',
}

const TOKEN_DAL_LP_ADDRESS = {
  1: '',
  3: '',
  4: '0x4eCbC91397384D861b44002FDDA7e40A3dd48684',
  5: '',
  42: '',
  56: '',
  97: '',
  42161: '',
  421611: '',
}

const TOKEN_DAL_DECIMAL = 18;

const FARM_ADDRESS = {
  1: '',
  3: '',
  4: '0x3F7a0bb6151a6AEba14bc664a8FB57D8a1196fd9',
  5: '',
  42: '',
  56: '',
  97: '0x62c5E6304F1F71E21252D7dd53d9Fea89670F727',
  42161: '',
  421611: '',
}

const TOKEN_METRIC_ADDRESS = {
  1: '',
  3: '',
  4: '0xFf09Af2F37e4cCb52059517A8a9a5f111fa56Cad',
  5: '',
  42: '',
  56: '',
  97: '0x4272073D490431E83a4D75a9880C5a46B2d5A48F',
  42161: '',
  421611: '',
}

const SORT_TYPE = {
  END_TIME_ASC: 'END_TIME',
  START_TIME_ASC: 'START_TIME',
  FOLLOWERS_DESC: 'FOLLOWERS',
  HIGH_LIQUIDITI_RATIO_DESC: 'HIGH_LIQUIDITI_RATIO',
  SOFT_CAFT_REACHED_DESC: 'SOFT_CAFT_REACHED',
  RAISE_AMOUNT_DESC: 'RAISE_AMOUNT',
  PARTICIPANTS_DESC: 'PARTICIPANTS',
}

const DATABASE_DEFAULT = {
  LIMIT: 20,
  PAGE: 1,
}

const SYSTEM_CONFIG = {
  GET_GAS_PRICE_NETWORK: 'GET_GAS_PRICE_NETWORK',
}

const ETHERSCAN_URL = {
  1: getNetworkKey('NETWORK_1_API_URL'),
  4: getNetworkKey('NETWORK_4_API_URL'),
  56: getNetworkKey('NETWORK_56_API_URL'),
  97: getNetworkKey('NETWORK_97_API_URL'),
}

module.exports = {
  LISTING_RATE_LIMIT,
  INITIAL_LIQUIDITY_PERIOD_LIMIT,
  LOCK_LIQUIDITY,
  CURRENCIES,
  EXCHANGE_LIST,
  NETWORK_LIST,
  CONTRACT_ABI,
  PROVIDERS,
  CURRENCY,
  UNISWAP,
  UNISWAP_ABI,
  USDT_ABI,
  NETWORK_ID_LIST,
  DAOLAUNCH_FEE,
  BUSD_ABI,
  PAYMENT_CURRENCIES,
  PANCAKE_ABI,
  NOT_LISTED_UNISWAP_DATA_RESULT,
  getNetworkKey,
  // ADMIN_WALLETS,
  UNISWAP_ROUTERS,
  UNISWAP_LOCKERS,
  TOKEN_DAL_ADDRESS,
  TOKEN_DAL_DECIMAL,
  FARM_ADDRESS,
  SORT_TYPE,
  TOKEN_METRIC_ADDRESS,
  DATABASE_DEFAULT,
  TOKEN_DAL_LP_ADDRESS,
  SYSTEM_CONFIG,
  ETHERSCAN_URL,
};
