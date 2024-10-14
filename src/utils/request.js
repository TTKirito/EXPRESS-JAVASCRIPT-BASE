import axios from 'axios';
import { DATABASE_DEFAULT, SORT_TYPE } from './constants'
import { sequelize } from '../core/boot';

/**
 * @description Get http request
 * @param {String} url
 * @param {Object|null} query
 * @param {Object|null} headers
 */
const apiGet = ({ url, query = null, headers = null }) => {
  const queryString = query ? Object.keys(query).map(item => `${item}=${query[item]}`).join('&') : '';

  const configs = {};
  if (headers) {
    configs.headers = headers;
  }

  return axios.get(
    url + (queryString ? `?${queryString}` : ''),
    {
      headers,
    }
  )
    .then(res => res.data);
}

const parseNumber = (value, defaultValue = 0) => {
  value = parseInt(value, 10)
  return Number.isNaN(value) || value < 0 ? defaultValue : value
}

const checkPagination = (page = 1, limit = DATABASE_DEFAULT.LIMIT) => {
  page = parseNumber(page, DATABASE_DEFAULT.PAGE)
  limit = parseNumber(limit, DATABASE_DEFAULT.LIMIT)
  const offset = page > 0 ? (page - 1) * limit : page
  return {
      offset,
      limit
  }
}


const getOption = (params, order = [['created_at', 'DESC']]) => {
  let { sort_type, page, limit } = params
  let option = checkPagination(page, limit)
  option.order = order
  // type sort
  switch (sort_type) {
    case SORT_TYPE.END_TIME_ASC:
      option.order = [['sale', 'sale_end_time', 'ASC']]
      break;
    case SORT_TYPE.START_TIME_ASC:
      option.order = [['sale', 'sale_start_time', 'ASC']]
      break;
    case SORT_TYPE.HIGH_LIQUIDITI_RATIO_DESC:
      option.order = [['sale', 'initial_liquidity_per', 'DESC']]
      break;
    case SORT_TYPE.SOFT_CAFT_REACHED_DESC:
      option.order = [[ sequelize.cast(sequelize.col('sale.soft_cap'), 'DOUBLE') , 'DESC' ]]
      break;
    case SORT_TYPE.RAISE_AMOUNT_DESC:
      option.order = [[ sequelize.cast(sequelize.col('presale.total_base_collected'), 'DOUBLE') , 'DESC']]
      break;
    case SORT_TYPE.PARTICIPANTS_DESC:
      option.order = [[ sequelize.cast(sequelize.col('presale.number_buyers'), 'INTEGER') , 'DESC' ]]
      break;
    case SORT_TYPE.FOLLOWERS_DESC:
      option.order = [['follow_number', 'DESC']]
      break;
    default:
      break;
  }
  option.subQuery = false
  return option
}

const hexNumber = (number) => {
  return `0x${parseInt(number).toString(16)}`;
}

export {
  getOption,
  checkPagination,
  apiGet,
  hexNumber,
}
