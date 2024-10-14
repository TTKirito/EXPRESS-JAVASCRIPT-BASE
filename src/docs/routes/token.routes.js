import {listTokens, token, rawDataTransaction, tokenData, USDTBalance, listTokenMetrics} from '../schema/token.schema'
import {
  internalServerError,
  invalidTokenDecimalPlace,
  depositAmountCannotBeNegativeNumber,
  tokenNotFound,
  walletIsNotOwnerOfToken,
  tokenLockDataInvalid,
  missingDistributionAddress,
  invalidDistributionAddress,
  tokenLockDataDistributionTypesInvalid,
  tokenLockDataDistributionIntervalInvalid,
  tokenLockDataAllocationExceedLimit,
  tokenLockPercentInvalid,
  totalPercentOfTokenAllocationNotEnough,
  thisTokenIsAlreadySettingTokenMetrics,
  distributionTimeMustBeAfterCurrentServerTime,
  distributionTimeMustBeAfterListingTime,
  tokenLockDataDistributionTypesMustBeSetTheDate,
  tokenMetricsItemNotFound,
  tokenMetricsItemIsLocked,
  tokenMetricsOfThisTokenNotExisted,
  allocationNameIsDuplicate,
  tokenMetricsItemNotLocked
} from '../common/errors';

  const security = [
    {
      bearerAuth: [],
    },
  ];


  const getMyToken = {
    tags: ['Tokens'],
    description: 'Retrieve all my tokens',
    operationId: 'getMyToken',
    security,
    parameters: [],
    responses: {
      '200': {
        description: 'Events retrieved successfully!',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: listTokens,
              },
            },
          },
        },
      },
      '500': internalServerError
    },
  };

  const createToken = {
    tags: ['Tokens'],
    description: 'Create new token',
    operationId: 'createToken',
    security,
    parameters: [],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/createTokenBody',
          },
        },
      },
      required: true,
    },
    responses: {
      '200': {
        description: 'Events create token successfully!',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: token,
            },
          },
        },
      },
      '500': internalServerError,
    },
  };

  const generateTokenData = {
    tags: ['Tokens'],
    description: 'Generate Token Data',
    operationId: 'generateTokenData',
    security,
    parameters: [],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/generateTokenBody',
          },
        },
      },
      required: true,
    },
    responses: {
      '200': {
        description: 'Events get data for create token successfully!',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: rawDataTransaction,
            },
          },
        },
      },
      '500': internalServerError,
    },
  };

  const getTokenDetailByAddress = {
    tags: ['Tokens'],
    description: 'Get detail of token by address',
    operationId: 'getTokenDetailByAddress',
    security,
    parameters: [
      {
        name: 'address',
        in: 'path',
        schema: {
          type: 'string',
          description: 'Token address',
          example: '0x3B0cBbE081c6D7fB6ccb72D49f862dF3A38a18eB',
          required: true,
        }
      },{
        name: 'spender',
        in: 'path',
        schema: {
          type: 'string',
          description: 'Token address',
          example: '0x6Fdaaa20bA023d69f0E921fd93f83A255fED657E',
          required: true,
        }
      },{
        name: 'is_valid_address',
        in: 'path',
        schema: {
          type: 'boolean',
          description: 'Token address',
          example: '0x6Fdaaa20bA023d69f0E921fd93f83A255fED657E',
          required: false,
        }
      },
    ],
    responses: {
      '200': {
        description: 'Events Get detail of token by address successfully!',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: tokenData,
              },
            },
          },
        },
      },
      '500': internalServerError,
    },
  };

  const getApproveTokenData = {
    tags: ['Tokens'],
    description: 'Get raw data for approve token',
    operationId: 'getApproveTokenData',
    security,
    parameters: [],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/getApproveTokenBody',
          },
        },
      },
      required: true,
    },
    responses: {
      '200': {
        description: 'Events get raw data for approve token successfully!',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: rawDataTransaction,
            },
          },
        },
      },
      '500': internalServerError,
    },
  };

  const getUSDTBalance = {
    tags: ['Tokens'],
    description: 'Get USDT balance of wallet',
    operationId: 'getUSDTBalance',
    security,
    parameters: [],
    requestBody: {},
    responses: {
      '200': {
        description: 'Events get USDT balance of wallet successfully!',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: USDTBalance,
            },
          },
        },
      },
      '500': internalServerError,
    },
  };

  const settingTokenMetrics = {
    tags: ['Tokens'],
    description: 'Submit setting token metrics',
    operationId: 'settingTokenMetrics',
    security,
    parameters: [
      {
        name: 'id',
        in: 'path',
        schema: {
          type: 'string',
          description: 'Token id',
          example: '1',
          required: true,
        }
      }
    ],
    requestBody: {},
    responses: {
      '200': {
        description: 'Events submit setting token metrics successfully!',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {type: 'boolean', example: true},
                result: {type: 'boolean', example: true}
              },
            },
          },
        },
      },
      '200-1': tokenNotFound,
      '200-2': walletIsNotOwnerOfToken,
      '200-3': thisTokenIsAlreadySettingTokenMetrics,
      '200-4': tokenMetricsOfThisTokenNotExisted,
      '500': internalServerError,
    },
  };

  const confirmSettingTokenMetrics = {
    tags: ['Tokens'],
    description: 'Confirm setting token metrics',
    operationId: 'confirmSettingTokenMetrics',
    security,
    parameters: [
      {
        name: 'id',
        in: 'path',
        schema: {
          type: 'string',
          description: 'Token id',
          example: '1',
          required: true,
        }
      }
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/confirmSettingTokenMetricsBody',
          },
        },
      },
      required: true,
    },
    responses: {
      '200': {
        description: 'Events submit setting token metrics successfully!',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                result: {type: 'object', properties: {
                    isLock: { type: 'boolean', example: true },
                    data: {type: 'string', example: '0x60806040523480156200001157600080fd5b50604051620012593803806200125983398101604081905262000034916200034b565b8351849084906200004d906003906020850190620001fa565b50805162000063906004906020840190620001fa565b505050620000806200007a620000bd60201b60201c565b620000c1565b620000956200008e620000bd565b8262000113565b506005805460ff909216600160a01b0260ff60a01b19909216919091179055506200048a9050565b3390565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b038216620001455760405162461bcd60e51b81526004016200013c90620003d2565b60405180910390fd5b6200015360008383620001f5565b806002600082825462000167919062000412565b90915550506001600160a01b038216600090815260208190526040812080548392906200019690849062000412565b90915550506040516001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90620001db90859062000409565b60405180910390a3620001f160008383620001f5565b5050565b505050565b828054620002089062000437565b90600052602060002090601f0160209004810192826200022c576000855562000277565b82601f106200024757805160ff191683800117855562000277565b8280016001018555821562000277579182015b82811115620002775782518255916020019190600101906200025a565b506200028592915062000289565b5090565b5b808211156200028557600081556001016200028a565b600082601f830112620002b1578081fd5b81516001600160401b0380821115620002ce57620002ce62000474565b6040516020601f8401601f1916820181018381118382101715620002f657620002f662000474565b60405283825285840181018710156200030d578485fd5b8492505b8383101562000330578583018101518284018201529182019162000311565b838311156200034157848185840101525b5095945050505050565b6000806000806080858703121562000361578384fd5b84516001600160401b038082111562000378578586fd5b6200038688838901620002a0565b955060208701519150808211156200039c578485fd5b50620003ab87828801620002a0565b935050604085015160ff81168114620003c2578283fd5b6060959095015193969295505050565b6020808252601f908201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604082015260600190565b90815260200190565b600082198211156200043257634e487b7160e01b81526011600452602481fd5b500190565b6002810460018216806200044c57607f821691505b602082108114156200046e57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b610dbf806200049a6000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c806370a0823111610097578063a457c2d711610066578063a457c2d7146101d5578063a9059cbb146101e8578063dd62ed3e146101fb578063f2fde38b1461020e576100f5565b806370a082311461019d578063715018a6146101b05780638da5cb5b146101b857806395d89b41146101cd576100f5565b806323b872dd116100d357806323b872dd1461014d578063313ce56714610160578063395093511461017557806342966c6814610188576100f5565b806306fdde03146100fa578063095ea7b31461011857806318160ddd14610138575b600080fd5b610102610221565b60405161010f91906109c0565b60405180910390f35b61012b610126366004610960565b6102b3565b60405161010f91906109b5565b6101406102d0565b60405161010f9190610cf2565b61012b61015b366004610925565b6102d6565b61016861036f565b60405161010f9190610cfb565b61012b610183366004610960565b61037f565b61019b610196366004610989565b6103d3565b005b6101406101ab3660046108d2565b6103e7565b61019b610406565b6101c0610451565b60405161010f91906109a1565b610102610460565b61012b6101e3366004610960565b61046f565b61012b6101f6366004610960565b6104e8565b6101406102093660046108f3565b6104fc565b61019b61021c3660046108d2565b610527565b60606003805461023090610d38565b80601f016020809104026020016040519081016040528092919081815260200182805461025c90610d38565b80156102a95780601f1061027e576101008083540402835291602001916102a9565b820191906000526020600020905b81548152906001019060200180831161028c57829003601f168201915b5050505050905090565b60006102c76102c0610595565b8484610599565b50600192915050565b60025490565b60006102e384848461064d565b6001600160a01b038416600090815260016020526040812081610304610595565b6001600160a01b03166001600160a01b03168152602001908152602001600020549050828110156103505760405162461bcd60e51b815260040161034790610b66565b60405180910390fd5b6103648561035c610595565b858403610599565b506001949350505050565b600554600160a01b900460ff1690565b60006102c761038c610595565b84846001600061039a610595565b6001600160a01b03908116825260208083019390935260409182016000908120918b16815292529020546103ce9190610d09565b610599565b6103e46103de610595565b82610777565b50565b6001600160a01b0381166000908152602081905260409020545b919050565b61040e610595565b6001600160a01b031661041f610451565b6001600160a01b0316146104455760405162461bcd60e51b815260040161034790610bae565b61044f6000610869565b565b6005546001600160a01b031690565b60606004805461023090610d38565b6000806001600061047e610595565b6001600160a01b03908116825260208083019390935260409182016000908120918816815292529020549050828110156104ca5760405162461bcd60e51b815260040161034790610cad565b6104de6104d5610595565b85858403610599565b5060019392505050565b60006102c76104f5610595565b848461064d565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b61052f610595565b6001600160a01b0316610540610451565b6001600160a01b0316146105665760405162461bcd60e51b815260040161034790610bae565b6001600160a01b03811661058c5760405162461bcd60e51b815260040161034790610a98565b6103e481610869565b3390565b6001600160a01b0383166105bf5760405162461bcd60e51b815260040161034790610c69565b6001600160a01b0382166105e55760405162461bcd60e51b815260040161034790610ade565b6001600160a01b0380841660008181526001602090815260408083209487168084529490915290819020849055517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92590610640908590610cf2565b60405180910390a3505050565b6001600160a01b0383166106735760405162461bcd60e51b815260040161034790610c24565b6001600160a01b0382166106995760405162461bcd60e51b815260040161034790610a13565b6106a4838383610864565b6001600160a01b038316600090815260208190526040902054818110156106dd5760405162461bcd60e51b815260040161034790610b20565b6001600160a01b03808516600090815260208190526040808220858503905591851681529081208054849290610714908490610d09565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161075e9190610cf2565b60405180910390a3610771848484610864565b50505050565b6001600160a01b03821661079d5760405162461bcd60e51b815260040161034790610be3565b6107a982600083610864565b6001600160a01b038216600090815260208190526040902054818110156107e25760405162461bcd60e51b815260040161034790610a56565b6001600160a01b0383166000908152602081905260408120838303905560028054849290610811908490610d21565b90915550506040516000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90610854908690610cf2565b60405180910390a3610864836000845b505050565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b80356001600160a01b038116811461040157600080fd5b6000602082840312156108e3578081fd5b6108ec826108bb565b9392505050565b60008060408385031215610905578081fd5b61090e836108bb565b915061091c602084016108bb565b90509250929050565b600080600060608486031215610939578081fd5b610942846108bb565b9250610950602085016108bb565b9150604084013590509250925092565b60008060408385031215610972578182fd5b61097b836108bb565b946020939093013593505050565b60006020828403121561099a578081fd5b5035919050565b6001600160a01b0391909116815260200190565b901515815260200190565b6000602080835283518082850152825b818110156109ec578581018301518582016040015282016109d0565b818111156109fd5783604083870101525b50601f01601f1916929092016040019392505050565b60208082526023908201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260408201526265737360e81b606082015260800190565b60208082526022908201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604082015261636560f01b606082015260800190565b60208082526026908201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160408201526564647265737360d01b606082015260800190565b60208082526022908201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604082015261737360f01b606082015260800190565b60208082526026908201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604082015265616c616e636560d01b606082015260800190565b60208082526028908201527f45524332303a207472616e7366657220616d6f756e74206578636565647320616040820152676c6c6f77616e636560c01b606082015260800190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b60208082526021908201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736040820152607360f81b606082015260800190565b60208082526025908201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604082015264647265737360d81b606082015260800190565b60208082526024908201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646040820152637265737360e01b606082015260800190565b60208082526025908201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604082015264207a65726f60d81b606082015260800190565b90815260200190565b60ff91909116815260200190565b60008219821115610d1c57610d1c610d73565b500190565b600082821015610d3357610d33610d73565b500390565b600281046001821680610d4c57607f821691505b60208210811415610d6d57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fdfea2646970667358221220053c72678924040ba51739e60aafc76215cc394c86c0c229da5e9f55086f8bf264736f6c63430008000033000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000152d02c7e14af68000000000000000000000000000000000000000000000000000000000000000000004746573740000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035453540000000000000000000000000000000000000000000000000000000000'},
                    gas: {type: 'string', example: '0xe7a8f'}
                  }
                }
              },
            },
          },
        },
      },
      '200-1': tokenNotFound,
      '200-2': thisTokenIsAlreadySettingTokenMetrics,
      '200-3': walletIsNotOwnerOfToken,
      '200-4': tokenLockDataInvalid,
      '200-5': allocationNameIsDuplicate,
      '200-6': tokenLockDataAllocationExceedLimit,
      '200-7': missingDistributionAddress,
      '200-8': invalidDistributionAddress,
      '200-9': tokenLockDataDistributionTypesInvalid,
      '200-10': tokenLockDataDistributionTypesMustBeSetTheDate,
      '200-11': distributionTimeMustBeAfterCurrentServerTime,
      '200-12': distributionTimeMustBeAfterListingTime,
      '200-13': tokenLockDataDistributionIntervalInvalid,
      '200-14': totalPercentOfTokenAllocationNotEnough,
      '200-15': tokenMetricsItemNotFound,
      '200-16': tokenMetricsItemIsLocked,
      '200-17': tokenLockPercentInvalid,
      '500': internalServerError,
    },
  };

  const getTokenMetricsInfo = {
    tags: ['Tokens'],
    description: 'Get token metrics info',
    operationId: 'getTokenMetricsInfo',
    security,
      parameters: [
        {
          name: 'id',
          in: 'path',
          schema: {
            type: 'string',
            description: 'Token id',
            example: '1',
            required: true,
          }
        }
      ],
    requestBody: {},
    responses: {
      '200': {
        description: 'Events get token metrics info successfully!',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: listTokenMetrics,
            },
          },
        },
      },
      '200-1': tokenNotFound,
      '200-2': walletIsNotOwnerOfToken,
      '500': internalServerError,
    },
  };

  const getClaimData = {
    tags: ['Tokens'],
    description: 'Get raw data for claim token metrics',
    operationId: 'getClaimData',
    security,
      parameters: [
        {
          name: 'id',
          in: 'path',
          schema: {
            type: 'string',
            description: 'Token id',
            example: '1',
            required: true,
          }
        }
      ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: {
              type: 'object',
              properties: {
                token_metrics_id: {type: 'number', example: 1},
              },
              required: [
                'token_metrics_id'
              ]
            },
          },
        },
      },
      required: true,
    },
    responses: {
      '200': {
        description: 'Events get raw data for claim token metrics successfully!',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: rawDataTransaction,
            },
          },
        },
      },
      '200-1': tokenNotFound,
      '200-2': walletIsNotOwnerOfToken,
      '200-3': tokenMetricsItemNotFound,
      '200-4': tokenMetricsItemNotLocked,
      '500': internalServerError,
    },
  };

  export { getMyToken, createToken, generateTokenData, getTokenDetailByAddress, getApproveTokenData, getUSDTBalance, confirmSettingTokenMetrics, settingTokenMetrics, getTokenMetricsInfo, getClaimData };
