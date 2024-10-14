import BigNumber from 'bignumber.js';
import { body } from 'express-validator';
import moment from 'moment';
import { requiredType, valueRequired } from '../../middlewares/validators';
import { isStringNumeric } from '../../utils/common';
import { errors } from '../../utils/system';
import { Validator } from '../validator';

export default [
  valueRequired([
    { value: 'contract_address', type: requiredType.string },
    { value: 'presale_owner', type: requiredType.string },
    { value: 'presale_token', type: requiredType.string },
    { value: 'base_token', type: requiredType.string },
    { value: 'white_list', type: requiredType.boolean },
    { value: 'uint_params', type: requiredType.array },
    { value: 'network_id', type: requiredType.string },
    { value: 'distribution_date', type: requiredType.string },
    { value: 'distribution_interval', type: requiredType.string },
    { value: 'distribution_interval_period', type: requiredType.string },
    { value: 'first_unlock_rate', type: requiredType.string },
    { value: 'unlock_rate', type: requiredType.string },
  ]
  ),
  /** value 1: amount */
  body('uint_params').custom(value => {
    return isStringNumeric(value[0]) && new BigNumber(value[0]).isGreaterThanOrEqualTo(0)
  })
    .withMessage(errors.INVALID_SALE_ALLOCATION),
  /** value 2: token price */
  body('uint_params').custom(value => {
    return isStringNumeric(value[1]) && new BigNumber(value[1]).isGreaterThanOrEqualTo(0)
  })
    .withMessage(errors.INVALID_TOKEN_PRICE),
  /** value 3: max allocation */
  body('uint_params').custom(value => {
    return isStringNumeric(value[2]) && new BigNumber(value[2]).isGreaterThanOrEqualTo(0)
  })
    .withMessage(errors.REQUIRED_MAX_ALLOCATION_WALLET),
  /** value 4: min allocation */
  body('uint_params').custom(value => {
    return isStringNumeric(value[3]) && new BigNumber(value[3]).isGreaterThanOrEqualTo(0)
  })
    .withMessage(errors.REQUIRED_MIN_ALLOCATION_WALLET),
  /** value 5: hard cap */
  body('uint_params').custom(value => {
    return isStringNumeric(value[4]) && new BigNumber(value[4]).isGreaterThanOrEqualTo(0)
  })
    .withMessage(errors.HARD_CAP_MUST_BE_A_NUMBER),
  /** value 6: soft cap */
  body('uint_params').custom(value => {
    return isStringNumeric(value[5]) && new BigNumber(value[5]).isGreaterThanOrEqualTo(0)
  })
    .withMessage(errors.SOFT_CAP_MUST_BE_A_NUMBER),
  /** value 7: initial_liquidity_per */
  body('uint_params').custom(value => {
    return isStringNumeric(value[6]) && new BigNumber(value[6]).isGreaterThanOrEqualTo(0)
  })
    .withMessage(errors.INITIAL_LIQUIDITY_MUST_BE_A_NUMBER),
  /** value 8: swap ratio */
  body('uint_params').custom(value => {
    return isStringNumeric(value[7]) && new BigNumber(value[7]).isGreaterThanOrEqualTo(0)
  })
    .withMessage(errors.SWAP_RATIO_MUST_BE_A_NUMBER),
  /** value 9: start time */
  body('uint_params').custom(value => {
    return value && moment(new Date(value[8])).isValid()
  })
    .withMessage(errors.START_TIME_MUST_BE_A_DATE),
  /** value 10: end time */
  body('uint_params').custom(value => {
    return value && moment(new Date(value[9])).isValid()
  })
    .withMessage(errors.END_TIME_MUST_BE_A_DATE),
  /** value 11: liquidity */
  body('uint_params').custom(value => {
    return isStringNumeric(value[10]) && new BigNumber(value[10]).isGreaterThanOrEqualTo(0)
  })
    .withMessage(errors.INVALID_LIQUIDITY),
  /** value 12: listing time */
  body('uint_params').custom(value => {
    return value && moment(new Date(value[11])).isValid()
  })
    .withMessage(errors.LISTING_TIME_MUST_BE_A_DATE),
  Validator.check()
];
