import winston from './winston';
import winstonLb from 'winston';
import moment from 'moment';

const errors = {
  /** SERVER ERRORS */
  SYSTEM_ERROR: { code: 'SYSTEM_ERROR' },
  ENV_NOT_SET_ERROR: { code: 'ENV_NOT_SET_ERROR' },
  SERVER_SHUTTING_DOWN: { code: 'SERVER_SHUTTING_DOWN' },
  DUPLICATED_ERROR: { code: 'DUPLICATED_ERROR' },
  WEBSITE_IS_UNDER_MAINTENANCE: { code: 'WEBSITE_IS_UNDER_MAINTENANCE' },
  LISTEN_ERROR: { code: 'LISTEN_ERROR' },
  USER_NOT_FOUND: { code: 'USER_NOT_FOUND' },
  WRONG_PASSWORD: { code: 'WRONG_PASSWORD' },
  NOT_AUTHENTICATED_ERROR: { code: 'NOT_AUTHENTICATED_ERROR' },
  PERMISSION_DENIED: { code: 'PERMISSION_DENIED' },

  /** WALLET ERROR */
  TOKEN_EXPIRED_ERROR: { code: 'TOKEN_EXPIRED_ERROR' },
  INVALID_TOKEN: { code: 'INVALID_TOKEN' },
  INVALID_ADDRESS: { code: 'INVALID_ADDRESS' },
  INVALID_CURRENCY: { code: 'INVALID_CURRENCY' },
  INVALID_TOKEN_ADDRESS: { code: 'INVALID_TOKEN_ADDRESS' },
  INVALID_CHAIN_ID: { code: 'INVALID_CHAIN_ID' },
  INVALID_WALLET: { code: 'INVALID_WALLET' },

  /** AWS ERRORS */
  FILE_TYPE_INVALID: { code: 'FILE_TYPE_INVALID' },
  REQUIRED_FILE_NAME: { code: 'REQUIRED_FILE_NAME' },
  FILE_NAME_IS_STRING: { code: 'FILE_NAME_IS_STRING' },

  /** PROJECT ERRORS */
  WALLET_NOT_FOUND: { code: 'WALLET_NOT_FOUND' },
  INVALID_SALE_ALLOCATION: { code: 'INVALID_SALE_ALLOCATION' },
  INVALID_TOKEN_PRICE: { code: 'INVALID_TOKEN_PRICE' },
  INVALID_PAYMENT_CURRENCY: { code: 'INVALID_PAYMENT_CURRENCY' },
  MAX_ALLOCATION_WALLET_MUST_BE_LOWER_THAN_HARD_CAP: { code: 'ALLOCATION_WALLET_MUST_BE_BIGGER_THEN_SALE_ALLOCATION' },
  MIN_ALLOCATION_WALLET_MUST_BE_LOWER_THEN_MAX_ALLOCATION_WALLET: { code: 'ALLOCATION_WALLET_MUST_BE_LOWER_THEN_MAX_ALLOCATION_WALLET' },
  SALE_START_TIME_MUST_BE_GREATER_THAN_CURRENT_SERVER_TIME: { code: 'SALE_START_TIME_MUST_BE_GREATER_THAN_CURRENT_SERVER_TIME' },
  SALE_START_TIME_MUST_BE_LESS_THAN_30_DAYS_FROM_NOW: { code: 'SALE_START_TIME_MUST_BE_LESS_THAN_30_DAYS_FROM_NOW' },
  SALE_END_TIME_MUST_BE_LESS_THAN_90_DAYS_FROM_SALE_START_TIME: { code: 'SALE_END_TIME_MUST_BE_LESS_THAN_90_DAYS_FROM_SALE_START_TIME' },
  SALE_START_TIME_MUST_BE_AFTER_CURRENT_SERVER_TIME: { code: 'SALE_START_TIME_MUST_BE_AFTER_CURRENT_SERVER_TIME' },
  LISTING_TIME_MUST_BE_BIGGER_THAN_SALE_END_TIME: { code: 'LISTING_TIME_MUST_BE_BIGGER_THAN_SALE_END_TIME' },
  INVALID_LOCK_LIQUIDITY: { code: 'INVALID_LOCK_LIQUIDITY' },
  REQUIRED_MAX_ALLOCATION_WALLET: { code: 'REQUIRED_MAX_ALLOCATION_WALLET' },
  REQUIRED_MIN_ALLOCATION_WALLET: { code: 'REQUIRED_MIN_ALLOCATION_WALLET' },
  INVALID_LIST_AMM: { code: 'INVALID_LIST_AMM' },
  INVALID_CURRENCY_PAIR: { code: 'INVALID_CURRENCY_PAIR' },
  INVALID_ACCESS_TYPE: { code: 'INVALID_ACCESS_TYPE' },
  INVALID_WHITELIST: { code: 'INVALID_WHITELIST' },
  PROJECT_NOT_FOUND: { code: 'PROJECT_NOT_FOUND' },
  SALE_NOT_FOUND: { code: 'SALE_NOT_FOUND' },
  SALE_AND_CONTRACT_ADDRESS_IS_NOT_MATCHING: { code: 'SALE_AND_CONTRACT_ADDRESS_IS_NOT_MATCHING' },
  WALLET_NOT_IN_WHITELIST: { code: 'WALLET_NOT_IN_WHITELIST' },
  NOT_ENOUGH_USDT_IN_WALLET: { code: 'NOT_ENOUGH_USDT_IN_WALLET' },
  SOFT_CAP_MUST_BE_BIGGER_THAN_0: { code: 'SOFT_CAP_MUST_BE_BIGGER_THAN_0' },
  NOT_ENOUGH_BUSD_IN_WALLET: { code: 'NOT_ENOUGH_BUSD_IN_WALLET' },
  CONTRACT_ADDRESS_IS_LIVE_OR_UPCOMING: { code: 'CONTRACT_ADDRESS_IS_LIVE_OR_UPCOMING' },
  ALL_TOKEN_HAS_BEEN_SOLD_OUT: { code: 'ALL_TOKEN_HAS_BEEN_SOLD_OUT' },
  TOTAL_TOKEN_BOUGHT_AND_BUYING_HAS_EXCEEDED_THE_LIMIT: { code: 'TOTAL_TOKEN_BOUGHT_AND_BUYING_HAS_EXCEEDED_THE_LIMIT' },
  HARD_CAP_MUST_BE_A_NUMBER: { code: 'HARD_CAP_MUST_BE_A_NUMBER' },
  SOFT_CAP_MUST_BE_A_NUMBER: { code: 'SOFT_CAP_MUST_BE_A_NUMBER' },
  INITIAL_LIQUIDITY_MUST_BE_A_NUMBER: { code: 'INITIAL_LIQUIDITY_MUST_BE_A_NUMBER' },
  SWAP_RATIO_MUST_BE_A_NUMBER: { code: 'SWAP_RATIO_MUST_BE_A_NUMBER' },
  START_TIME_MUST_BE_A_DATE: { code: 'START_TIME_MUST_BE_A_DATE' },
  END_TIME_MUST_BE_A_DATE: { code: 'END_TIME_MUST_BE_A_DATE' },
  INVALID_LIQUIDITY: { code: 'INVALID_LIQUIDITY' },
  LISTING_TIME_MUST_BE_A_DATE: { code: 'LISTING_TIME_MUST_BE_A_DATE' },
  START_TIME_OF_NEXT_TIME_MUST_BE_AFTER_END_TIME_OF_THE_PREVIOUS: { code: 'START_TIME_OF_NEXT_TIME_MUST_BE_AFTER_END_TIME_OF_THE_PREVIOUS' },
  START_TIME_MUST_BE_BEFORE_LISTING_TIME: { code: 'START_TIME_MUST_BE_BEFORE_LISTING_TIME' },
  START_TIME_MUST_BE_BEFORE_END_TIME: { code: 'START_TIME_MUST_BE_BEFORE_END_TIME' },
  NOT_HAVE_ACCESS: { code: 'NOT_HAVE_ACCESS' },

  /** TOKEN ERRORS */
  INVALID_TOKEN_SUPPLY: { code: 'INVALID_TOKEN_SUPPLY' },
  INVALID_TOKEN_DECIMAL_PLACE: { code: 'INVALID_TOKEN_DECIMAL_PLACE' },
  DEPOSIT_AMOUNT_CANNOT_BE_NEGATIVE_NUMBER: { code: 'DEPOSIT_AMOUNT_CANNOT_BE_NEGATIVE_NUMBER' },
  TOKEN_NOT_FOUND: { code: 'TOKEN_NOT_FOUND' },
  WALLET_IS_NOT_OWNER_OF_TOKEN: { code: 'TOKEN_NOT_FOUND' },
  TOKEN_LOCK_DATA_INVALID: { code: 'TOKEN_LOCK_DATA_INVALID' },
  MISSING_DISTRIBUTION_ADDRESS: { code: 'MISSING_DISTRIBUTION_ADDRESS' },
  INVALID_DISTRIBUTION_ADDRESS: { code: 'INVALID_DISTRIBUTION_ADDRESS' },
  TOKEN_LOCK_DATA_DISTRIBUTION_TYPES_INVALID: { code: 'TOKEN_LOCK_DATA_DISTRIBUTION_TYPES_INVALID' },
  TOKEN_LOCK_DATA_DISTRIBUTION_INTERVAL_INVALID: { code: 'TOKEN_LOCK_DATA_DISTRIBUTION_INTERVAL_INVALID' },
  TOKEN_LOCK_DATA_ALLOCATION_EXCEED_LIMIT: { code: 'TOKEN_LOCK_DATA_ALLOCATION_EXCEED_LIMIT' },
  TOKEN_LOCK_PERCENT_INVALID: { code: 'TOKEN_LOCK_PERCENT_INVALID' },
  TOTAL_PERCENT_OF_TOKEN_ALLOCATION_NOT_ENOUGH: { code: 'TOTAL_PERCENT_OF_TOKEN_ALLOCATION_NOT_ENOUGH' },
  THIS_TOKEN_IS_ALREADY_SETTING_TOKEN_METRICS: { code: 'THIS_TOKEN_IS_ALREADY_SETTING_TOKEN_METRICS' },
  DISTRIBUTION_TIME_MUST_BE_AFTER_CURRENT_SERVER_TIME: { code: 'DISTRIBUTION_TIME_MUST_BE_AFTER_CURRENT_SERVER_TIME' },
  DISTRIBUTION_TIME_MUST_BE_AFTER_LISTING_TIME: { code: 'DISTRIBUTION_TIME_MUST_BE_AFTER_LISTING_TIME' },
  TOKEN_LOCK_DATA_DISTRIBUTION_TYPES_MUST_BE_SET_THE_DATE: { code: 'TOKEN_LOCK_DATA_DISTRIBUTION_TYPES_MUST_BE_SET_THE_DATE' },
  TOKEN_METRICS_ITEM_NOT_FOUND: { code: 'TOKEN_METRICS_ITEM_NOT_FOUND' },
  TOKEN_METRICS_ITEM_IS_LOCKED: { code: 'TOKEN_METRICS_ITEM_IS_LOCKED' },
  TOKEN_METRICS_OF_THIS_TOKEN_NOT_EXISTED: { code: 'TOKEN_METRICS_OF_THIS_TOKEN_NOT_EXISTED' },
  ALLOCATION_NAME_IS_DUPLICATE: { code: 'ALLOCATION_NAME_IS_DUPLICATE' },
  TOKEN_METRICS_ITEM_NOT_LOCKED: { code: 'TOKEN_METRICS_ITEM_NOT_LOCKED' },

  /** NETWORK ERRORS */
  INVALID_NETWORK: { code: 'INVALID_NETWORK' },
  INVALID_ABI: { code: 'INVALID_ABI' },

  /** TRANSACTION ERRORS */
  NO_TRANSACTIONS_FOUND: { code: 'NO_TRANSACTIONS_FOUND' },

  /** PRESALE ERRORS */
  CAN_NOT_GET_DEPOSIT: { code: 'CAN_NOT_GET_DEPOSIT' },

  /** EXCHANGE ERRORS */
  CAN_NOT_GET_GAS_PRICE: { code: 'CAN_NOT_GET_GAS_PRICE' },

  /** PURCHASE ERRORS */
  NOT_YET_TIME_FOR_PURCHASING: { code: 'NOT_YET_TIME_FOR_PURCHASING' },
  TOKEN_SALE_HAS_ENDED: { code: 'TOKEN_SALE_HAS_ENDED' },

  /** FEATURED TOKEN ERRORS */
  TOKEN_CONTRACT_ADDRESS_EXISTED: { code: 'TOKEN_CONTRACT_ADDRESS_EXISTED' },

  /** PROJECT DRAFT ERRORS */
  INVALID_PROJECT_DRAFT_TYPE: { code: 'INVALID_PROJECT_DRAFT_TYPE' },

  /** NFT */
  CREATE_NFT_FARM_ERROR: { code: 'CREATE_NFT_FARM_ERROR' },

  /** UNDERSTAND */

  PROJECT_IS_UNDERSTAND: { code : 'PROJECT_IS_UNDERSTAND' },

  /** PITCH */

  BODY_IS_ARRAY: { code: 'BODY_IS_ARRAY' },
  PROJECT_PITCH_ID_IS_NUMBER: { code: 'PROJECT_ID_IS_NUMBER' },
  NAVIGATION_TITLE_IS_STRING: { code: 'NAVIGATION_TITLE_IS_STRING' },
  UPLOADED_VIDEO_IS_STRING: { code: 'UPLOADED_VIDEO_IS_STRING' },
  HEADING_TITLE_IS_STRING: { code: 'HEADING_TITLE_IS_STRING' },
  CONTENT_TITLE_IS_TEXT: { code: 'CONTENT_TITLE_IS_TEXT' },
  ORDER_IS_NUMBER: { code: 'ORDER_IS_NUMBER' },
  DISPLAY_IS_BOOLEAN: { code: 'DISPLAY_IS_BOOLEAN' },
}

const jsonSuccess = (result = null) => {
  return { success: true, result };
};

const jsonError = (err = null) => {
  return { success: false, error: err };
};

/** Define group log */
const logAttribute = {
  group: { order: 'order', estimation: 'estimation', mail: 'mail' },
  action: { create: 'create' },
  prefix: { admin: 'admin', user: 'user' },
  type: { info: 'info', error: 'error' }
};

/** Config logger */
const configLogger = ({ data, group, action, prefix, type }) => {
  try {
    if (group && action && prefix && type) {
      const isInValidParams = !logAttribute.group[group]
        || !logAttribute.action[action]
        || !logAttribute.prefix[prefix]
        || !logAttribute.type[type];

      if (isInValidParams) {
        console.log('[LOGGER] Group log is invalid!');
        return;
      }

      const date = moment().format('YYYY-MM-DD');
      const filename = `${getEnv('PATH_LOG')}/${prefix}/${type}/${group}/${action}/${date}.log`;

      const fileLogger = winstonLb.createLogger({
        transports: [
          new (winstonLb.transports.File)({
            filename: filename,
            colorize: true
          })
        ],
        exitOnError: false
      });

      data = type === logAttribute.type.error ? { name: data.name, message: data.message } : data;
      fileLogger[type]({ time: moment(), data });
    }
  } catch (error) {
    console.log(error)
    throw error;
  }
};

const logger = {
  verbose: message => {
    if (getEnv('FULL_LOG') !== 'true') return;
    return winston.verbose(message);
  },
  warn: message => {
    if (getEnv('FULL_LOG') !== 'true') return;
    return winston.warn(message);
  },
  error: (message, error, attr) => {
    /** Write log*/
    configLogger({ ...attr, data: error, type: logAttribute.type.error });

    return winston.error(`${message}::${error}`);
  },
  info: (message, attr) => {
    try {
      /** Write log*/
      configLogger({ ...attr, type: logAttribute.type.info });
      return winston.info(message);
    } catch (error) {
      throw error;
    }
  }
};

/**
 * Exception handler in catch controller
 * @param {Object} res response
 * @param {any} error error
 */
const handleExceptionResponse = (res, errName, err) => {
  // Logger
  logger.error(`${new Date().toDateString()}_${errName}`, err);

  if (err.original && err.original.code === 'ERR_DUP_ENTRY') {
    return res.json(jsonError(errors.DUPLICATED_ERROR));
  }

  return res.json(jsonError(errors.SYSTEM_ERROR));
};

export {
  jsonSuccess,
  jsonError,
  logger,
  errors,
  handleExceptionResponse,
}
