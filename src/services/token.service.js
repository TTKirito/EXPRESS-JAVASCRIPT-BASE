import { errors, jsonError, jsonSuccess, logger } from '../utils/system';
import { Sequelize } from 'sequelize';
import { TokenRepository } from '../repositories/token.repository';
import Web3 from 'web3';
import {
  BUSD_ABI,
  CONTRACT_ABI,
  CURRENCY, DAOLAUNCH_FEE,
  NETWORK_ID_LIST,
  NETWORK_LIST,
  NOT_LISTED_UNISWAP_DATA_RESULT,
  PROVIDERS, TOKEN_METRIC_ADDRESS,
  USDT_ABI,
  ETHERSCAN_URL,
} from '../utils/constants';
import { ABI as ERC20ABI, bytecode as ERC20Bytecode } from "../abi/ethereum/ERC20.js";
import { ABI as TokenMetricsABI, } from "../abi/ethereum/TokenMetric";
import data from '../block-chain/service/data';
import { Wallet } from '../models/schema/wallet.model';
import BigNumber from 'bignumber.js';
import { APPROVAL_TYPES, TRANSACTION_STATUS } from '../models/schema/token.model';
import { ProjectRepository } from '../repositories/project.repository';
import { TokenMetricsRepository } from '../repositories/token-metrics.repository';
import { Sale } from '../models/schema/sale.model';
import { TokenMetrics, DISTRIBUTION_TYPES, DISTRIBUTION_INTERVAL_TYPES } from '../models/schema/token-metrics.model';
import { projectService } from './project.service';
import { exchangeService } from './uniswap.service';
import { sequelize } from '../core/boot';
import moment from 'moment';
import {convertTimeToSecond, getRegexWithDecimalPlace} from "../utils/common";
import {ABI as PresaleGeneratorABI} from "../abi/ethereum/PresaleGenerator01";
import { apiGet } from '../utils/request';

const { Op } = Sequelize;

class TokenService {
  constructor() {
    this.tokenRepository = new TokenRepository();
    this.projectRepository = new ProjectRepository();
    this.tokenMetricsRepository = new TokenMetricsRepository();
  }

  /**
   * @description Save wallet and generate token
   */
  async createToken(
    {
      wallet,
      token_name,
      token_symbol,
      token_supply,
      token_decimal_place,
      token_contract_address,
      token_transaction_hash,
    }
  ) {
    try {
      const newToken = await this.tokenRepository.create({
        wallet_id: wallet.wallet_id,
        // network_id: wallet.network_id,
        token_name,
        token_symbol,
        token_supply,
        token_decimal_place: token_decimal_place.toString(),
        token_contract_address,
        token_transaction_status: TRANSACTION_STATUS.PENDING,
        token_transaction_hash,
      });

      return jsonSuccess(newToken);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_CREATE_TOKEN_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  async getMyTokens({ wallet }, { limit, page }) {
    let transaction;
    try {
      const unCompletedTokens = await this.tokenRepository.findAll({
        condition: {
          wallet_id: wallet.wallet_id,
          token_transaction_status: TRANSACTION_STATUS.PENDING,
          token_transaction_hash: { [Op.ne]: null },
          // network_id: wallet.network_id,
        }
      });

      if (unCompletedTokens && unCompletedTokens.length > 0) {
        const ethMainNetKey = 'https://mainnet.infura.io/v3/6f91a6ef31a448bb917663fed3a5fd72';
        const ropstenKey = 'https://ropsten.infura.io/v3/6f91a6ef31a448bb917663fed3a5fd72';
        const kovanKey = getEnv('KOVAN_KEY') || 'https://kovan.infura.io/v3/c89e5dd56f704c38b8dcac0bb6cce0fe';
        const rinkebyKey = 'https://rinkeby.infura.io/v3/6f91a6ef31a448bb917663fed3a5fd72';
        const goerliKey = 'https://goerli.infura.io/v3/6f91a6ef31a448bb917663fed3a5fd72';
        const bscMain = 'https://bsc-dataseed.binance.org'
        const bscTestNet = 'https://data-seed-prebsc-1-s1.binance.org:8545/'

        const web3EthMain = new Web3(ethMainNetKey);
        const web3Ropsten = new Web3(ropstenKey);
        const web3Kovan = new Web3(kovanKey);
        const web3Rinkeby = new Web3(rinkebyKey);
        const web3Goerli = new Web3(goerliKey);
        const web3BscMain = new Web3(bscMain);
        const web3BscTestnet = new Web3(bscTestNet);

        await Promise.all(
          unCompletedTokens.map(x => {
            if (x.token_transaction_hash) {
              switch (wallet.network_id) {
                case NETWORK_ID_LIST.ETH:
                  return this.getTokenTransactionReceipt({ wallet, token: x, web3Instance: web3EthMain })
                case NETWORK_ID_LIST.ROPSTEN:
                  return this.getTokenTransactionReceipt({ wallet, token: x, web3Instance: web3Ropsten })
                case NETWORK_ID_LIST.KOVAN:
                  return this.getTokenTransactionReceipt({ wallet, token: x, web3Instance: web3Kovan })
                case NETWORK_ID_LIST.RINKEBY:
                  return this.getTokenTransactionReceipt({ wallet, token: x, web3Instance: web3Rinkeby })
                case NETWORK_ID_LIST.GOERLI:
                  return this.getTokenTransactionReceipt({ wallet, token: x, web3Instance: web3Goerli })
                case NETWORK_ID_LIST.BSC_MAINNET:
                  return this.getTokenTransactionReceipt({ wallet, token: x, web3Instance: web3BscMain })
                case NETWORK_ID_LIST.BSC_TESTNET:
                  return this.getTokenTransactionReceipt({ wallet, token: x, web3Instance: web3BscTestnet })
                default:
                  break;
              }
            }
          })
        )
      }

      const tokens = await this.tokenRepository.getAll({
        page: +page,
        limit: +limit,
        condition: {
          wallet_id: wallet.wallet_id,
          token_transaction_status: TRANSACTION_STATUS.COMPLETED
          // network_id: wallet.network_id,
        },
        raw: true,
      });

      transaction = await sequelize.transaction();

      /** Check is listed on uniswap eth */
      const checkList = ['ETH', 'USDT', 'BNB', 'BUSD'];
      tokens.rows = await Promise.all(
        tokens.rows.map(async token => {
          let updateUniswapData = token.uniswap_list;

          /** Check is list in uniswap or pancakeswap */
          for (const net of checkList) {
            if (!updateUniswapData.includes(net)) {
              const isListedUniswapEth = await exchangeService.getFair({
                sale_token: token.token_contract_address,
                network_id: wallet.network_id,
                base_token: net,
              });

              if (isListedUniswapEth.success && isListedUniswapEth.result !== NOT_LISTED_UNISWAP_DATA_RESULT) {
                updateUniswapData = updateUniswapData + `${net},`;
              }
            }
          }

          if (token.uniswap_list !== updateUniswapData) {
            token.uniswap_list = updateUniswapData;
            await this.tokenRepository.updateById(
              token.token_id,
              { uniswap_list: token.uniswap_list },
              transaction,
            );
          }
          return token;
        })
      );

      await transaction.commit();

      const network = NETWORK_LIST.find(net => net.NETWORK_ID === wallet.network_id);
      const web3 = new Web3(network.NODE_RPC);
      for (let token of tokens.rows) {
        const tokenContract = new web3.eth.Contract(CONTRACT_ABI, token.token_contract_address)
        let [
          decimal,
          balance,
        ] = await Promise.all([
          tokenContract.methods.decimals().call(),
          tokenContract.methods.balanceOf(wallet.wallet_address).call(), // wallet address
        ]);
        let maxBalance = new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimal)).toNumber();
        token.adjustedBalance = maxBalance;
      }

      return jsonSuccess(tokens);
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      logger.error(`${new Date().toDateString()}_ERRORS_GET_MY_TOKENS_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  async getTokenTransactionReceipt({ wallet, token, web3Instance }) {
    try {
      const info = await web3Instance.eth.getTransactionReceipt(token.token_transaction_hash)

      if (info && info.blockHash) {
        if (info.status === false) {
          return await this.tokenRepository.updateOne(
            {
              wallet_id: wallet.wallet_id,
              token_transaction_status: TRANSACTION_STATUS.FAILED,
              token_contract_address: info.contractAddress,
            },
            {
              token_id: token.token_id
            },
          )
        }

        return await this.tokenRepository.updateOne(
          {
            wallet_id: wallet.wallet_id,
            token_transaction_status: TRANSACTION_STATUS.COMPLETED,
            token_contract_address: info.contractAddress,
          },
          {
            token_id: token.token_id
          },
        )
      }
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_TRANSACTION_RECEIPT_FUNCTION`, error);
      throw error
    }
  }

  /**
   * @description Get detail of token address
   * @param {String} address
   * @param {Object} wallet
   * @param {String} is_valid_address
   * @param {String} spender
   */
  async getDetailOfTokenByAddress({ address }, { wallet }, { is_valid_address, spender }) {
    try {
      const project = await this.projectRepository.getOne(
        {
          token_contract_address: address,
        },
        {
          include: {
            model: Wallet,
            as: 'wallet',
          },
        },
      )
      if (!wallet) {
        if (project && project.wallet) {
          const result = await this.tokenDetailProcessingWithAddress(address, project.wallet.wallet_address, project.wallet.network_id)
          return jsonSuccess(result)
        }
        return jsonSuccess({})
      }

      const dataToken = await this.tokenDetailProcessingWithAddress(address, wallet.wallet_address, wallet.network_id);

      if (is_valid_address === 'true') {
        dataToken.isSuccessOrLiveUpcoming = await projectService.checkIsContractAddressSuccessOrLiveUpcoming(address, wallet);
      }

      const contract = this.getWeb3WithProvider(ERC20ABI, address, wallet.network_id);
      const tokens_approved = await contract.methods.allowance(
        wallet.wallet_address,
        spender || project.token_contract_address
      ).call();

      return jsonSuccess(
        {
          ...dataToken,
          tokens_approved,
        }
      );
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_TOKENS_DETAIL_BY_ADDRESS_SERVICE`, error);
      return jsonError(errors.INVALID_TOKEN_ADDRESS);
    }
  }

  async generateTokenData({ wallet, token_name, token_decimal_place, token_supply, token_symbol }) {
    try {
      let token_data

      const { network_id, wallet_address } = wallet

      const bigNumber = new BigNumber(10).pow(token_decimal_place).multipliedBy(token_supply).toString(16);
      const numAsHex = "0x" + bigNumber;

      if (![56, 97].includes(network_id)) {
        token_data = await data.getERC20Data([token_name, token_symbol, token_decimal_place, numAsHex], network_id, wallet_address)
      } else {
        token_data = await data.getBEP20Data([token_name, token_symbol, token_decimal_place, numAsHex], network_id, wallet_address)
      }

      return jsonSuccess({
        data: token_data.data,
        gas: '0x' + BigNumber(token_data.gas).toString(16)
      });
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_TOKEN_DATA_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  async getApproveTokenData({ contractAddress, networkId, spender, amount, fromAddress, sale_start_time, sale_end_time, type }) {
    try {
      const now = new Date()
      if (type === APPROVAL_TYPES.CREATE_TOKEN_SALE) {
        /** check if sale start time valid with server time */
        if (sale_start_time && moment(new Date(sale_start_time)).isBefore(moment(now))) {
          return jsonError(errors.SALE_START_TIME_MUST_BE_AFTER_CURRENT_SERVER_TIME)
        }
      } else if (type === APPROVAL_TYPES.PURCHASING) {
        /** check if sale start time valid with server time */
        if (sale_start_time && moment(new Date(sale_start_time)).isAfter(moment(now))) {
          return jsonError(errors.NOT_YET_TIME_FOR_PURCHASING)
        }
        /** check if sale end time valid with server time */
        if (sale_end_time && moment(new Date(sale_end_time)).isBefore(moment(now))) {
          return jsonError(errors.TOKEN_SALE_HAS_ENDED)
        }
      }

      const contract = this.getWeb3WithProvider(ERC20ABI, contractAddress, networkId);
      const approve = contract.methods.approve(spender, amount);
      const gas = await approve.estimateGas({ from: fromAddress });
      return jsonSuccess({
        data: approve.encodeABI(),
        gas: Web3.utils.toHex(gas)
      })
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_APPROVE_TOKEN_DATA_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  async getUSDTBalance({ wallet }) {
    try {
      let abi;
      let decimals;
      let contractAddr;
      if ([56, 97].includes(wallet.network_id)) {
        abi = BUSD_ABI;
        decimals = new BigNumber(10).pow(18).toString(10);
        contractAddr = CURRENCY[wallet.network_id]['BUSD'];
      } else {
        abi = USDT_ABI;
        decimals = new BigNumber(10).pow(6).toString(10);
        contractAddr = CURRENCY[wallet.network_id]['USDT'];
      }

      const contract = this.getWeb3WithProvider(abi, contractAddr, wallet.network_id);
      const balanceOf = await contract.methods.balanceOf(wallet.wallet_address).call();
      return jsonSuccess({
        balance: new BigNumber(balanceOf).toString(10),
        adjustedBalance: new BigNumber(balanceOf).dividedBy(decimals).toString(10),
      });
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_USED_BALANCE_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**** FUNCTIONS IN SERVICE ******/
  getWeb3WithProvider(abi, address, networkId) {
    const provider = PROVIDERS[networkId] || 0;
    if (provider === 0) throw new Error('INVALID_NETWORK_ID');

    const web3Instance = new Web3(Web3.givenProvider || provider);
    return new web3Instance.eth.Contract(abi, address);
  }

  async tokenDetailProcessingWithAddress(address, wallet_address, network_id) {
    try {
      const network = NETWORK_LIST.find(net => net.NETWORK_ID === network_id);

      const web3 = new Web3(network.NODE_RPC);

      const projects = await this.projectRepository.findAll({
        condition: { token_contract_address: address },
        include: {
          model: Sale,
          as: 'sale',
        },
      })

      let totalUsed = 0
      projects.forEach(project => {
        if (project.sale && project.sale.sale_allocation) {
          totalUsed += +project.sale.sale_allocation
        }
      })

      const tokenContract = new web3.eth.Contract(CONTRACT_ABI, address)

      const [
        decimal,
        balance,
        tokenName,
        tokenSymbol,
        totalSupply,
      ] = await Promise.all([
        tokenContract.methods.decimals().call(),
        tokenContract.methods.balanceOf(wallet_address).call(), // wallet address
        tokenContract.methods.name().call(),
        tokenContract.methods.symbol().call(),
        tokenContract.methods.totalSupply().call(),
      ]);

      const adjustedBalance = new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimal));

      return {
        decimal,
        balance,
        adjustedBalance,
        tokenName,
        tokenSymbol,
        numberOfRound: projects && projects.length,
        totalSupply: new BigNumber(totalSupply).dividedBy(Math.pow(10, decimal)).toString(10),
        balanceNotOnSale: +adjustedBalance - totalUsed
      };
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_TOKEN_DETAIL_PROCESSING_FUNCTION`, error);
      throw error;
    }
  }

  async settingTokenMetrics({ id }, { wallet }) {
    try {
      const token = await this.tokenRepository.getOne({token_id: id}, {
        include: {
            model: Wallet,
            as: 'wallet',
          }
      });

      if (!token)
        return jsonError(errors.TOKEN_NOT_FOUND);

      if (token && token.wallet && token.wallet.wallet_id !== wallet.wallet_id)
        return jsonError(errors.WALLET_IS_NOT_OWNER_OF_TOKEN);

      if (token.is_setting)
        return jsonError(errors.THIS_TOKEN_IS_ALREADY_SETTING_TOKEN_METRICS);

      let updated = {};

      const tokenMetrics = await this.tokenMetricsRepository.findAll({condition: {token_id: id}})
      if (!tokenMetrics)
        return jsonError(errors.TOKEN_METRICS_OF_THIS_TOKEN_NOT_EXISTED);
      await this.tokenMetricsRepository.update({token_id: id},{is_confirm: true});
      let totalPercentLocked = await this.tokenMetricsRepository.findAndSum({is_locked: true, token_id: id, is_confirm: true}, 'lock_percent')

      if (Number(totalPercentLocked) === 100)
        updated = {
          ...updated,
          is_setting: true
        }
      if (!token.token_metrics_confirm)
        updated = {
          ...updated,
          token_metrics_confirm: true
        }

      await this.tokenRepository.updateOne(
        { ...updated },
        {token_id: id}
      );

      return jsonSuccess(true);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_SUBMIT_SETTING_TOKEN_METRICS_FUNCTION`, error);
      throw error;
    }
  }

  async confirmSettingTokenMetrics({id},{wallet, locations}) {
    let transaction;
    try {
      const token_id = id;
      const token = await this.tokenRepository.getOne({token_id}, {
        include: {
          model: Wallet,
          as: 'wallet',
        }
      });
      if (!token)
        return jsonError(errors.TOKEN_NOT_FOUND);

      if (token.is_setting)
        return jsonError(errors.THIS_TOKEN_IS_ALREADY_SETTING_TOKEN_METRICS);

      if (token && token.wallet && token.wallet.wallet_id !== wallet.wallet_id)
        return jsonError(errors.WALLET_IS_NOT_OWNER_OF_TOKEN);

      let tokenSaleExisted = false;
      let checkTokenSaleExists = await this.projectRepository.findAll({
        condition: {token_contract_address: token.token_contract_address},
        include: [
          {
            model: Sale,
            as: 'sale',
          }
        ],
      });

      if (checkTokenSaleExists.length) {
        tokenSaleExisted = true;
      }

      let totalPercent = 0;
      let dataConfirm = [];
      let attributeCreate = [];
      let attributeUpdated = [];
      let allocationNames = [];
      const regexLockPercent = getRegexWithDecimalPlace(1);

      const network = NETWORK_LIST.find(net => net.NETWORK_ID === wallet.network_id);
      const web3 = new Web3(network.NODE_RPC);
      const tokenContract = new web3.eth.Contract(CONTRACT_ABI, token.token_contract_address)

      let [
        decimal,
        balance,
      ] = await Promise.all([
        tokenContract.methods.decimals().call(),
        tokenContract.methods.balanceOf(wallet.wallet_address).call(), // wallet address
      ]);
      const totalSupply = token.token_supply;

      let maxBalance = new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimal)).toNumber();

      let totalBalanceSetting = 0;
      transaction = await sequelize.transaction();
      let checkLockExisted = false;

      if (!token.token_metrics_confirm) {
        for (let item of locations) {
          const { allocation_name, lock_percent, lock_detail } = item;
          let attribute;
          const result = regexLockPercent.exec(lock_percent);
          if (!Array.isArray(result) || Number(result[0]) !== Number(lock_percent)) {
            return jsonError(errors.TOKEN_LOCK_PERCENT_INVALID);
          }
          totalPercent = new BigNumber(totalPercent.toString()).plus(lock_percent).toNumber();

          //check duplicate allocation_name
          if (allocationNames.includes(allocation_name))
            return jsonError(errors.ALLOCATION_NAME_IS_DUPLICATE);
          allocationNames.push(allocation_name);

          const total_balance = new BigNumber(totalSupply.toString()).times(lock_percent.toString()).dividedBy(100).toString();
          totalBalanceSetting = new BigNumber(totalBalanceSetting.toString()).plus(total_balance.toString()).toNumber();

          if (totalBalanceSetting > maxBalance)
            return jsonError(errors.TOKEN_LOCK_DATA_ALLOCATION_EXCEED_LIMIT);

          attribute = {
            token_id,
            allocation_name,
            lock_percent,
            is_locked: false,
            total_balance: new BigNumber(total_balance).decimalPlaces(4).toNumber(),
            is_confirm: false
          }
          if (lock_detail) {
            checkLockExisted = true;
            const {
              distribution_type,
              distribution_interval,
              first_unlock_rate,
              unlock_rate,
              distribution_address,
              distribution_interval_period
            } = lock_detail;
            let distribution_date = lock_detail.distribution_date;
            if (!distribution_address)
              return jsonError(errors.MISSING_DISTRIBUTION_ADDRESS);

            const check = Web3.utils.isAddress(distribution_address, wallet.network_id);

            if (!check) {
              return jsonError(errors.INVALID_DISTRIBUTION_ADDRESS);
            }
            if (Number(first_unlock_rate) <= 0 || Number(unlock_rate) < 0 || new BigNumber(first_unlock_rate).plus(unlock_rate).toNumber() > 100)
              return jsonError(errors.TOKEN_LOCK_DATA_INVALID);

            if (!tokenSaleExisted) {
              if (distribution_type !== DISTRIBUTION_TYPES.SET_DATE)
                return jsonError(errors.TOKEN_LOCK_DATA_DISTRIBUTION_TYPES_MUST_BE_SET_THE_DATE);
              // todo check distribution_date condition
              const now = new Date();
              if (distribution_date && moment(new Date(distribution_date)).isBefore(moment(now))) {
                return jsonError(errors.DISTRIBUTION_TIME_MUST_BE_AFTER_CURRENT_SERVER_TIME)
              }
            } else {
              const listingTime = checkTokenSaleExists[0].sale && checkTokenSaleExists[0].sale.listing_time;
              switch (distribution_type) {
                case DISTRIBUTION_TYPES.SET_DATE:
                  if (distribution_date && moment(new Date(distribution_date)).isBefore(moment(listingTime))) {
                    return jsonError(errors.DISTRIBUTION_TIME_MUST_BE_AFTER_LISTING_TIME)
                  }
                  break;
                case DISTRIBUTION_TYPES.SAME_AS_LISTING:
                  distribution_date = listingTime
                  break;
                default:
                  return jsonError(errors.TOKEN_LOCK_DATA_DISTRIBUTION_TYPES_INVALID);
              }
            }
            if (Number(first_unlock_rate) < 100) {
              if (!Object.keys(DISTRIBUTION_INTERVAL_TYPES).includes(distribution_interval))
                return jsonError(errors.TOKEN_LOCK_DATA_DISTRIBUTION_INTERVAL_INVALID);
            }
            attribute = {
              ...attribute,
              is_locked: true,
              lock_detail: {
                ...lock_detail,
                distribution_date
              },
              index_for_claim: dataConfirm.length
            }
            let maxPeriod = distribution_date;
            let distributionInterval = distribution_interval;
            if (first_unlock_rate < 100) {
              let durationComplete = (new BigNumber(100).minus(first_unlock_rate))
                .dividedBy(unlock_rate)
                .integerValue(BigNumber.ROUND_CEIL)
                .times(distribution_interval_period).toNumber();
              if (distribution_interval === DISTRIBUTION_INTERVAL_TYPES.MONTHS) {
                // default 1 month = 30 days
                durationComplete = durationComplete * 30;
                distributionInterval = DISTRIBUTION_INTERVAL_TYPES.DAYS;
              }
              maxPeriod = moment(distribution_date)
                .add(durationComplete, distributionInterval)
                .format('ll')
            }

            dataConfirm.push([
              new BigNumber(lock_percent.toString()).times(10).toNumber(),
              new Date(distribution_date).getTime(),
              new BigNumber(first_unlock_rate.toString()).times(10).toNumber(),
              Number(first_unlock_rate) !== 100 ? convertTimeToSecond(distribution_interval_period, distribution_interval) : 0,
              new BigNumber(unlock_rate.toString() || 0).times(10).toNumber(),
              new Date(maxPeriod).getTime(),
              0,
              0,
              distribution_address
            ])
          }
          attributeCreate.push(attribute)
        }

        // if (Number(totalPercent) !== 100)
        //   return jsonError(errors.TOTAL_PERCENT_OF_TOKEN_ALLOCATION_NOT_ENOUGH);

        //remove old token metrics pre-setting
        this.tokenMetricsRepository.delete({ token_id }, transaction);
        // store db list token metrics, token is not confirm yet
        await this.tokenMetricsRepository.bulkCreate(attributeCreate, transaction);
      }
      else {
        let itemLock = await this.tokenMetricsRepository.Count({ condition: { is_locked: true, token_id, is_confirm: true } })
        const listMetricsLock = await this.tokenMetricsRepository.findAll({condition: {is_locked: true, token_id, is_confirm: true}})
        // let totalPercentLocked = 0;
        // let totalPercentAllow;
        if (listMetricsLock.length) {
          listMetricsLock.forEach(item => {
            // totalPercentLocked = new BigNumber(totalPercentLocked).plus(item.lock_percent.toString()).toString();
            allocationNames.push(item.allocation_name);
          })
        }
        // totalPercentAllow = new BigNumber(100).minus(totalPercentLocked).toNumber();
        for (let item of locations) {
          const { allocation_name, lock_percent, lock_detail, token_metrics_id } = item;
          let attribute;
          if (token_metrics_id) {
            const checkExisted = await this.tokenMetricsRepository.getOne({token_metrics_id, token_id: id});
            if (!checkExisted)
              return jsonError(errors.TOKEN_METRICS_ITEM_NOT_FOUND);
            if (checkExisted.is_locked)
              return jsonError(errors.TOKEN_METRICS_ITEM_IS_LOCKED);
          }
          const result = regexLockPercent.exec(lock_percent);
          if (!Array.isArray(result) || Number(result[0]) !== Number(lock_percent)) {
            return jsonError(errors.TOKEN_LOCK_PERCENT_INVALID);
          }
          totalPercent = new BigNumber(totalPercent.toString()).plus(lock_percent).toNumber();

          if (allocationNames.includes(allocation_name))
            return jsonError(errors.ALLOCATION_NAME_IS_DUPLICATE);
          allocationNames.push(allocation_name);

          const total_balance = new BigNumber(totalSupply.toString()).times(lock_percent.toString()).dividedBy(100).toString();
          totalBalanceSetting = new BigNumber(totalBalanceSetting.toString()).plus(total_balance.toString()).toNumber();
          if (totalBalanceSetting > maxBalance)
            return jsonError(errors.TOKEN_LOCK_DATA_ALLOCATION_EXCEED_LIMIT);

          attribute = {
            token_id,
            allocation_name,
            lock_percent,
            is_locked: false,
            total_balance: new BigNumber(total_balance).decimalPlaces(4).toNumber(),
            is_confirm: false
          }

          if (lock_detail) {
            checkLockExisted = true;
            const {
              distribution_type,
              distribution_interval,
              first_unlock_rate,
              unlock_rate,
              distribution_address,
              distribution_interval_period
            } = lock_detail;
            let distribution_date = lock_detail.distribution_date;
            if (!distribution_address)
              return jsonError(errors.MISSING_DISTRIBUTION_ADDRESS);

            const check = Web3.utils.isAddress(distribution_address, wallet.network_id);

            if (!check) {
              return jsonError(errors.INVALID_DISTRIBUTION_ADDRESS);
            }
            if (Number(first_unlock_rate) <= 0 || Number(unlock_rate) < 0 || new BigNumber(first_unlock_rate).plus(unlock_rate).toNumber() > 100)
              return jsonError(errors.TOKEN_LOCK_DATA_INVALID);

            if (!tokenSaleExisted) {
              if (distribution_type !== DISTRIBUTION_TYPES.SET_DATE)
                return jsonError(errors.TOKEN_LOCK_DATA_DISTRIBUTION_TYPES_MUST_BE_SET_THE_DATE);
              // todo check distribution_date condition
              const now = new Date();
              if (distribution_date && moment(new Date(distribution_date)).isBefore(moment(now))) {
                return jsonError(errors.DISTRIBUTION_TIME_MUST_BE_AFTER_CURRENT_SERVER_TIME)
              }
            } else {
              const listingTime = checkTokenSaleExists[0].sale && checkTokenSaleExists[0].sale.listing_time;
              switch (distribution_type) {
                case DISTRIBUTION_TYPES.SET_DATE:
                  if (distribution_date && moment(new Date(distribution_date)).isBefore(moment(listingTime))) {
                    return jsonError(errors.DISTRIBUTION_TIME_MUST_BE_AFTER_LISTING_TIME)
                  }
                  break;
                case DISTRIBUTION_TYPES.SAME_AS_LISTING:
                  distribution_date = listingTime
                  break;
                default:
                  return jsonError(errors.TOKEN_LOCK_DATA_DISTRIBUTION_TYPES_INVALID);
              }
            }
            if (Number(first_unlock_rate) < 100) {
              if (!Object.keys(DISTRIBUTION_INTERVAL_TYPES).includes(distribution_interval))
                return jsonError(errors.TOKEN_LOCK_DATA_DISTRIBUTION_INTERVAL_INVALID);
            }

            attribute = {
              ...attribute,
              is_locked: true,
              lock_detail: {
                ...lock_detail,
                distribution_date
              },
              index_for_claim: itemLock
            }
            itemLock++;

            let maxPeriod = distribution_date;
            let distributionInterval = distribution_interval;
            if (first_unlock_rate < 100) {
              let durationComplete = (new BigNumber(100).minus(first_unlock_rate))
                .dividedBy(unlock_rate)
                .integerValue(BigNumber.ROUND_CEIL)
                .times(distribution_interval_period).toNumber();
              if (distribution_interval === DISTRIBUTION_INTERVAL_TYPES.MONTHS) {
                // default 1 month = 30 days
                durationComplete = durationComplete * 30;
                distributionInterval = DISTRIBUTION_INTERVAL_TYPES.DAYS;
              }
              maxPeriod = moment(distribution_date)
                .add(durationComplete, distributionInterval)
                .format('ll')
            }

            dataConfirm.push([
              new BigNumber(lock_percent.toString()).times(10).toNumber(),
              new Date(distribution_date).getTime(),
              new BigNumber(first_unlock_rate.toString()).times(10).toNumber(),
              Number(first_unlock_rate) !== 100 ? convertTimeToSecond(distribution_interval_period, distribution_interval) : 0,
              new BigNumber(unlock_rate.toString() || 0).times(10).toNumber(),
              new Date(maxPeriod).getTime(),
              0,
              0,
              distribution_address
            ])
          }
          if (token_metrics_id) {
            attributeUpdated.push(this.tokenMetricsRepository.updateById(token_metrics_id, attribute, transaction))
          } else {
            attributeCreate.push(attribute)
          }
        }

        // if (Number(totalPercent) !== totalPercentAllow)
        //   return jsonError(errors.TOTAL_PERCENT_OF_TOKEN_ALLOCATION_NOT_ENOUGH);
        // update db list token metrics, exist -> update, not existed -> create; token is not confirm yet
        if (attributeUpdated.length)
          await Promise.all(attributeUpdated);
        if (attributeCreate.length)
          await this.tokenMetricsRepository.bulkCreate(attributeCreate, transaction);
      }

      let result = {
        isLock: checkLockExisted,
      }
      if (checkLockExisted) {
        // get raw data to submit transaction
        const tokenMetricsContract = TOKEN_METRIC_ADDRESS[wallet.network_id];
        const contract = this.getWeb3WithProvider(TokenMetricsABI, tokenMetricsContract, wallet.network_id);
        const updateTokenMetrics = contract.methods.updateTokenMetrics(token.token_contract_address, dataConfirm);
        const gas = await updateTokenMetrics.estimateGas({ from: wallet.wallet_address });
        result = {
          ...result,
          data: updateTokenMetrics.encodeABI(),
          gas: Web3.utils.toHex(gas)
        }
      }
      await transaction.commit();
      return jsonSuccess(result);
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      logger.error(`${new Date().toDateString()}_ERRORS_CONFIRM_TOKEN_METRICS_FUNCTION`, error);
      throw error;
    }
  }

  /**
   * Get token metrics info by token id
   * @param id
   * @param wallet
   * @returns {Promise<{result: null, success: boolean}>}
   */
  async getTokenMetricsInfo({ id }, { wallet }) {
    const token = await this.tokenRepository.getOne({ token_id: id }, {
      include: [
        {
          model: Wallet,
          as: 'wallet',
          attributes: ['wallet_id']
        },
        {
          model: TokenMetrics,
          as: 'token_metrics'
        }
      ]
    });

    if (!token) {
      return jsonError(errors.TOKEN_NOT_FOUND);
    }

    if (token && token.wallet && token.wallet.wallet_id !== wallet.wallet_id) {
      return jsonError(errors.WALLET_IS_NOT_OWNER_OF_TOKEN);
    }

    // if (token && token.network_id !== wallet.network_id) {
    //   return jsonError(errors.INVALID_NETWORK);
    // }

    const rows = token.token_metrics || [];

    let result = []
    for (let item of rows) {
      let itemTmp = item;
      if (item.is_locked && item.is_confirm) {
        const lockingPeriod = await this.getLockingTokenMetrics({
          network_id: wallet.network_id,
          token_contract_address: token.token_contract_address,
          index_for_claim: item.index_for_claim
        });
        itemTmp = {
          ...itemTmp,
          locking_period: {...lockingPeriod.result}
        }
      }
      result.push(itemTmp)
    }

    const count = (token.token_metrics && token.token_metrics.length) || 0;

    const current_server_time = new Date()

    return jsonSuccess({ count, rows: result, current_server_time })
  }

  /**
   * Get claim data token metrics
   * @param id
   * @param wallet
   * @param token_metrics_id
   * @returns {Promise<{result: null, success: boolean}>}
   */
  async getClaimData({ id }, { wallet, token_metrics_id }) {
    const token = await this.tokenRepository.getOne({ token_id: id }, {
      include: [
        {
          model: Wallet,
          as: 'wallet',
          attributes: ['wallet_id']
        },
        {
          model: TokenMetrics,
          as: 'token_metrics'
        }
      ]
    });

    if (!token) {
      return jsonError(errors.TOKEN_NOT_FOUND);
    }

    if (token && token.wallet && token.wallet.wallet_id !== wallet.wallet_id) {
      return jsonError(errors.WALLET_IS_NOT_OWNER_OF_TOKEN);
    }

    const checkExisted = await this.tokenMetricsRepository.getOne({token_metrics_id, token_id: id });
    if (!checkExisted)
      return jsonError(errors.TOKEN_METRICS_ITEM_NOT_FOUND);

    if (!checkExisted.is_locked || !checkExisted.is_confirm)
      return jsonError(errors.TOKEN_METRICS_ITEM_NOT_LOCKED);

    // get raw data to submit transaction
    const tokenMetricsContract = TOKEN_METRIC_ADDRESS[wallet.network_id];
    const contract = this.getWeb3WithProvider(TokenMetricsABI, tokenMetricsContract, wallet.network_id);
    const claimForId = contract.methods.claimForId(token.token_contract_address, checkExisted.index_for_claim );
    const gas = await claimForId.estimateGas({ from: wallet.wallet_address });
    return jsonSuccess({
      data: claimForId.encodeABI(),
      gas: Web3.utils.toHex(gas)
    });
  }

  /**
   * Get locking token metrics
   * @param network_id
   * @param token_contract_address
   * @param index_for_claim
   */
  async getLockingTokenMetrics({ network_id, token_contract_address, index_for_claim }) {
    try {
      const tokenMetricsContract = TOKEN_METRIC_ADDRESS[network_id];
      const contract = this.getWeb3WithProvider(TokenMetricsABI, tokenMetricsContract, network_id.toString());
      const result = await contract.methods.lockingPeriodInfo(token_contract_address, index_for_claim ).call();
      return jsonSuccess(result);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_LOCKING_TOKEN_METRICS_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * Get token owner
   * @param {*} token
   * @param {*} wallet
   */
  async getTokenOwner({ token }, { wallet }) {
    try {
      const { network_id } = wallet;
      const etherScanURL = ETHERSCAN_URL[network_id];
      let etherScanApiKey = '';

      switch(network_id) {
        case 1:
        case 4:
          etherScanApiKey = getEnv('ETHERSCAN_API_KEY');
          break;
        case 56:
        case 97:
          etherScanApiKey = getEnv('BSC_API_KEY');
          break;
      }

      if (etherScanApiKey === '') return jsonError('CANNOT_GET_ETHERSCAN_API_KEY')

      let res = await apiGet({url: `${etherScanURL}api?module=account&action=txlist&address=${token}&startblock=0&endblock=99999999999&page=1&offset=1&sort=asc&apikey=${etherScanApiKey}`});

      res = res && res.result;
      if (!res || res.length == 0) return jsonSuccess('');

      return jsonSuccess(res[0].from);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_TOKEN_OWNER_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }
}

export const tokenService = new TokenService();
