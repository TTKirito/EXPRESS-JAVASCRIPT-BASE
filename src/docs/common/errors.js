const internalServerError = {
  description: 'Internal Server Error',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Internal Server Error',
          },
        },
      },
    },
  },
};

const invalidTokenSupply = {
  description: 'Invalid Token Supply',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'INVALID_TOKEN_SUPPLY'}
            }}
        },
      },
    },
  },
};

const invalidTokenDecimalPlace = {
  description: 'Invalid Token Decimal Place',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'INVALID_TOKEN_DECIMAL_PLACE'}
            }}
        },
      },
    },
  },
};
const depositAmountCannotBeNegativeNumber = {
  description: 'Deposit Amount Cannot Be Negative Number',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'DEPOSIT_AMOUNT_CANNOT_BE_NEGATIVE_NUMBER'}
            }}
        },
      },
    },
  },
};
const tokenNotFound = {
  description: 'Token not found',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'TOKEN_NOT_FOUND'}
            }}
        },
      },
    },
  },
};
const walletIsNotOwnerOfToken = {
  description: 'Wallet Is Not Owner Of Token',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'WALLET_IS_NOT_OWNER_OF_TOKEN'}
            }}
        },
      },
    },
  },
};
const tokenLockDataInvalid = {
  description: 'Token Lock Data Invalid',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'TOKEN_LOCK_DATA_INVALID'}
            }}
        },
      },
    },
  },
};
const missingDistributionAddress = {
  description: 'Missing Distribution Address',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'MISSING_DISTRIBUTION_ADDRESS'}
            }}
        },
      },
    },
  },
};
const invalidDistributionAddress = {
  description: 'Invalid Distribution Address',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'INVALID_DISTRIBUTION_ADDRESS'}
            }}
        },
      },
    },
  },
};
const tokenLockDataDistributionTypesInvalid = {
  description: 'Token Lock Data Distribution Types Invalid',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'TOKEN_LOCK_DATA_DISTRIBUTION_TYPES_INVALID'}
            }}
        },
      },
    },
  },
};
const tokenLockDataDistributionIntervalInvalid = {
  description: 'Token Lock Data Distribution Interval Invalid',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'TOKEN_LOCK_DATA_DISTRIBUTION_INTERVAL_INVALID'}
            }}
        },
      },
    },
  },
};
const tokenLockDataAllocationExceedLimit = {
  description: 'Token Lock Data Allocation Exceed Limit',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'TOKEN_LOCK_DATA_ALLOCATION_EXCEED_LIMIT'}
            }}
        },
      },
    },
  },
};
const tokenLockPercentInvalid = {
  description: 'Token Lock Percent Invalid',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'TOKEN_LOCK_PERCENT_INVALID'}
            }}
        },
      },
    },
  },
};
const totalPercentOfTokenAllocationNotEnough = {
  description: 'Total Percent Of Token Allocation Not Enough',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'TOTAL_PERCENT_OF_TOKEN_ALLOCATION_NOT_ENOUGH'}
            }}
        },
      },
    },
  },
};
const thisTokenIsAlreadySettingTokenMetrics = {
  description: 'This Token Is Already Setting Token Metrics',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'THIS_TOKEN_IS_ALREADY_SETTING_TOKEN_METRICS'}
            }}
        },
      },
    },
  },
};
const distributionTimeMustBeAfterCurrentServerTime = {
  description: 'Distribution Time Must Be After Current Server Time',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'DISTRIBUTION_TIME_MUST_BE_AFTER_CURRENT_SERVER_TIME'}
            }}
        },
      },
    },
  },
};
const distributionTimeMustBeAfterListingTime = {
  description: 'Distribution Time Must Be After Listing Time',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'DISTRIBUTION_TIME_MUST_BE_AFTER_LISTING_TIME'}
            }}
        },
      },
    },
  },
};
const tokenLockDataDistributionTypesMustBeSetTheDate = {
  description: 'Token Lock Data Distribution Types Must Be Set The Date',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'TOKEN_LOCK_DATA_DISTRIBUTION_TYPES_MUST_BE_SET_THE_DATE'}
            }}
        },
      },
    },
  },
};
const tokenMetricsItemNotFound = {
  description: 'Token Metrics Item Not Found',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'TOKEN_METRICS_ITEM_NOT_FOUND'}
            }}
        },
      },
    },
  },
};
const tokenMetricsItemIsLocked = {
  description: 'Token Metrics Item Is Locked',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'TOKEN_METRICS_ITEM_IS_LOCKED'}
            }}
        },
      },
    },
  },
};
const tokenMetricsOfThisTokenNotExisted = {
  description: 'Token Metrics Of This Token Not Existed',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'TOKEN_METRICS_OF_THIS_TOKEN_NOT_EXISTED'}
            }}
        },
      },
    },
  },
};
const allocationNameIsDuplicate = {
  description: 'Allocation Name Is Duplicate',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'ALLOCATION_NAME_IS_DUPLICATE'}
            }}
        },
      },
    },
  },
};
const tokenMetricsItemNotLocked = {
  description: 'Token Metrics Item Not Locked',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: false},
          error: {type: 'object', properties: {
              code: {type: 'string', example: 'TOKEN_METRICS_ITEM_NOT_LOCKED'}
            }}
        },
      },
    },
  },
};



export {
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
}
