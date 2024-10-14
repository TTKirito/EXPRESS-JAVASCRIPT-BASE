import Web3 from 'web3';
import { ABI as ERC20ABI } from "../abi/ethereum/ERC20.js";
import { ABI as PresaleABI } from "../abi/ethereum/Presale01.js";
import { ABI as PresaleGeneratorABI } from "../abi/ethereum/PresaleGenerator01.js";
import { ABI as PresaleFactoryABI } from "../abi/common/PresaleFactory.js";
import { ABI as BSCPresaleABI } from "../abi/ethereum/BSCPresale01.js";
import { CURRENCIES, CURRENCY, PROVIDERS, USDT_ABI, DAOLAUNCH_FEE, BUSD_ABI, PAYMENT_CURRENCIES } from '../utils/constants';
import { errors, jsonError, jsonSuccess, logger } from '../utils/system';
import { ProjectRepository } from '../repositories/project.repository';
import { ACCESS_TYPE, Sale } from '../models/schema/sale.model';
import { Whitelist } from '../models/schema/whitelist.model';
import BigNumber from 'bignumber.js';
import { PresaleRepository } from '../repositories/presale.repository';
import { convertBaseCurrency } from '../utils/common';
import moment from 'moment';
import { WhitelistRepository } from "../repositories/whitelist.repository";
import { SaleRepository } from "../repositories/sale.repository";
import { Project } from "../models/schema/project.model";

class PresaleService {
  constructor() {
    this.projectRepository = new ProjectRepository();
    this.presaleRepository = new PresaleRepository();
    this.whitelistRepository = new WhitelistRepository();
    this.saleRepository = new SaleRepository();
  }

  /**
   * Get data for createPresale function
   * @param {String} contractAddress contract address
   * @param {String} presale_owner
   * @param {String} presale_token
   * @param {String} base_token
   * @param {String} white_list white list address
   * @param {Array} uint_params: 0:amount, 1: tokenPrice, 2: maxSpendPerBuyer, 3: minSpendPerBuyer, 4: hardcap, 5: softcap 6: liquidityPercent
   * @param {String} network_id
   * 7: listingRate, 8: startblock, 9: endblock, 10: lockPeriod, 11: uniswapListingTime
   * @returns : data and estimateGas
   */
  async getCreatePresaleData(
    {
      contract_address,
      presale_owner,
      presale_token,
      base_token,
      white_list,
      uint_params,
      network_id,
      sale_start_time,
      //TODO Fields still waiting  for validate
      distribution_date,
      distribution_interval,
      distribution_interval_period,
      first_unlock_rate,
      unlock_rate,
    }
  ) {
    try {
      const now = new Date()
      if (sale_start_time && moment(new Date(sale_start_time)).isBefore(moment(now))) {
        return jsonError(errors.SALE_START_TIME_MUST_BE_AFTER_CURRENT_SERVER_TIME)
      }

      const vesting_period = [distribution_date, first_unlock_rate, distribution_interval, unlock_rate, distribution_interval_period]

      const contract = this.getWeb3WithProvider(PresaleGeneratorABI, contract_address, network_id);
      const approve = contract.methods.createPresale(presale_owner, presale_token, base_token, white_list, uint_params, getEnv('CALLER_ADDR'), vesting_period);
      const gas = await approve.estimateGas({ from: presale_owner, value: DAOLAUNCH_FEE[network_id] });
      return jsonSuccess({
        data: approve.encodeABI(),
        gas: Web3.utils.toHex(gas)
      });
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_CREATE_PRESALE_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * Get deposit data
   * @param {String} contract_address contract address
   * @param {String} network_id network id
   * @param {String} token_amount number of token
   * @param {String} eth
   * @param {String} caller sender address
   * @param {Object} wallet
   * @returns: data and estimateGas
   */
  async getDepositData({ contract_address, network_id, token_amount, eth, caller, wallet, s, r, v }) {
    try {
      const project = await this.projectRepository.getOne(
        {
          contract_address,
        },
        {
          include: {
            model: Sale,
            as: 'sale',
            include: {
              model: Whitelist,
              as: 'white_lists',
            }
          }
        })

      if (project) {
        const now = new Date()
        /** check if sale start time valid with server time */
        if (project.sale.sale_start_time && moment(new Date(project.sale.sale_start_time)).isAfter(moment(now))) {
          return jsonError(errors.NOT_YET_TIME_FOR_PURCHASING)
        }

        /** check if sale end time valid with server time */
        if (project.sale.sale_end_time && moment(new Date(project.sale.sale_end_time)).isBefore(moment(now))) {
          return jsonError(errors.TOKEN_SALE_HAS_ENDED)
        }

        const contract = this.getWeb3WithProvider(PresaleABI, contract_address, wallet.network_id.toString());

        const presaleStatus = await contract.methods.STATUS().call();

        let totalSold
        if (presaleStatus) {
          totalSold = convertBaseCurrency(project.payment_currency, presaleStatus.TOTAL_BASE_COLLECTED)
        }

        if (project.sale.max_allocation_wallet_limit) {
          const buyer = await contract.methods.BUYERS(wallet.wallet_address).call();
          const deposited = convertBaseCurrency(project.payment_currency, buyer.baseDeposited)

          let totalBuying
          switch (project.payment_currency) {
            case PAYMENT_CURRENCIES.ETH:
            case PAYMENT_CURRENCIES.BNB:
              totalBuying = eth
              break
            case PAYMENT_CURRENCIES.USDT:
            case PAYMENT_CURRENCIES.BUSD:
              totalBuying = token_amount
              totalBuying = convertBaseCurrency(project.payment_currency, totalBuying)
              break
          }

          if (new BigNumber(totalBuying).plus(deposited).isGreaterThan(project.sale.max_allocation_wallet)) {
            return jsonError(errors.TOTAL_TOKEN_BOUGHT_AND_BUYING_HAS_EXCEEDED_THE_LIMIT)
          }
        }

        /** check if all token has been sold out */
        if (new BigNumber(totalSold).isGreaterThanOrEqualTo(project.sale.hard_cap)) {
          return jsonError(errors.ALL_TOKEN_HAS_BEEN_SOLD_OUT)
        }

        /** check if wallet can participate in private project */
        if (project.sale) {
          if (project.sale.access_type === ACCESS_TYPE.PRIVATE
            && project.sale.white_lists
            && !project.sale.white_lists.some(element => element.whitelist_wallet_address.toUpperCase() === wallet.wallet_address.toUpperCase())) {
            return jsonError(errors.WALLET_NOT_IN_WHITELIST)
          }
        }

        if (project.payment_currency === CURRENCIES.ETH.USDT) {
          const contract = this.getWeb3WithProvider(USDT_ABI, CURRENCY[wallet.network_id]['USDT'], wallet.network_id);
          const balanceOf = await contract.methods.balanceOf(wallet.wallet_address).call();
          if (new BigNumber(token_amount).isGreaterThan(balanceOf)) {
            return jsonError(errors.NOT_ENOUGH_USDT_IN_WALLET)
          }
        }

        if (project.payment_currency === CURRENCIES.BSC.BUSD) {
          const contract = this.getWeb3WithProvider(BUSD_ABI, CURRENCY[wallet.network_id]['BUSD'], wallet.network_id);
          const balanceOf = await contract.methods.balanceOf(wallet.wallet_address).call();
          if (new BigNumber(token_amount).isGreaterThan(balanceOf)) {
            return jsonError(errors.NOT_ENOUGH_BUSD_IN_WALLET)
          }
        }
      }
      const contract = this.getWeb3WithProvider(PresaleABI, contract_address, network_id);

      const userDeposit = contract.methods.userDeposit(token_amount, v, r, s);
      const gas = await userDeposit.estimateGas({ value: Web3.utils.toWei(eth, 'ether'), from: caller });

      return jsonSuccess({
        data: userDeposit.encodeABI(),
        gas: Web3.utils.toHex(gas)
      });
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_DEPOSIT_SERVICE`, error);
      return jsonError(errors.CAN_NOT_GET_DEPOSIT);
    }
  }

  /**
   * @note THIS FUNCTION IS USED IN OTHER SERVICES, PLEASE CHECK CAREFULLY BEFORE EDIT
   * @description Get presale status
   * @param contract_address {String} presale contract address
   * @param network_id {String} network id
   * @param project_id {Number}
   */
  async getPresaleStatus({ contract_address, network_id, project_id = null }) {
    try {
      let abi;
      if (network_id != 1 && network_id != 4) {
        abi = BSCPresaleABI;
      } else {
        abi = PresaleABI;
      }

      const contract = this.getWeb3WithProvider(abi, contract_address, network_id.toString());

      const result = await contract.methods.STATUS().call();

      return jsonSuccess({
        ...result,
        project_id,
        total_tokens_sold: result.TOTAL_TOKENS_SOLD,
        total_base_collected: result.TOTAL_BASE_COLLECTED,
        number_buyers: result.NUM_BUYERS,
        is_added_liquidity: result.ADDED_LIQUIDITY,
        is_force_failed: result.FORCE_FAILED,
        is_transferred_fee: result.IS_TRANSFERED_FEE,
        is_list_on_uniswap: result.LIST_ON_UNISWAP,
        total_base_withdrawn: result.TOTAL_BASE_WITHDRAWN,
        total_tokens_withdrawn: result.TOTAL_TOKENS_WITHDRAWN,
        is_whitelist_only: result.WHITELIST_ONLY,
        is_owner_withdrawn: result.IS_OWNER_WITHDRAWN,
      });
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_PRESALE_STATUS_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  async getPresaleAddress({ log }) {
    try {
      const abis = PresaleFactoryABI || [];
      let abi = abis.find(e => e.name === 'presaleRegistered' && e.type === 'event');
      if (!abi) {
        return jsonError(errors.INVALID_ABI)
      }

      const web3 = new Web3();
      const result = web3.eth.abi.decodeLog(abi.inputs, log);
      return jsonSuccess(result.presaleContract);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_PRESALE_ADDRESS_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * @description User claim token
   * @param wallet
   * @param project
   */
  async getClaimData({ wallet, project }) {
    try {
      const { contract_address } = project;
      const contract = this.getWeb3WithProvider(PresaleABI, contract_address, wallet.network_id.toString());

      const withdrawTokens = contract.methods.userWithdrawTokens();
      const gas = await withdrawTokens.estimateGas({ from: wallet.wallet_address }) + 10000;
      return jsonSuccess({
        data: withdrawTokens.encodeABI(),
        gas: Web3.utils.toHex(gas)
      });
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_CLAIM_DATA_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * @description User refund
   * @param wallet
   * @param project
   */
  async getRefundData({ wallet, project }) {
    try {
      const { contract_address } = project;

      const contract = this.getWeb3WithProvider(PresaleABI, contract_address, wallet.network_id.toString());

      const withdrawTokens = contract.methods.userWithdrawBaseTokens();
      const gas = await withdrawTokens.estimateGas({ from: wallet.wallet_address });
      return jsonSuccess({
        data: withdrawTokens.encodeABI(),
        gas: Web3.utils.toHex(gas)
      });
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_REFUND_DATA_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * @description Get allowanced data
   * @param wallet
   * @param contract_address
   * @param spender
   * @param network_id
   */
  async getAllowancedData({ wallet, contract_address, spender, network_id, sale_start_time, sale_end_time }) {
    try {
      const now = new Date()
      /** check if sale start time valid with server time */
      if (sale_start_time && moment(new Date(sale_start_time)).isAfter(moment(now))) {
        return jsonError(errors.NOT_YET_TIME_FOR_PURCHASING)
      }

      /** check if sale end time valid with server time */
      if (sale_end_time && moment(new Date(sale_end_time)).isBefore(moment(now))) {
        return jsonError(errors.TOKEN_SALE_HAS_ENDED)
      }

      const contract = this.getWeb3WithProvider(ERC20ABI, contract_address, network_id);
      const result = await contract.methods.allowance(
        wallet.wallet_address,
        spender
      ).call();

      return jsonSuccess(result);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_ALLOWANCED_DATA_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * Get buyer info
   * @param wallet
   * @param project
   */
  async getBuyerInfo({ wallet, project }) {
    try {
      const { contract_address } = project;
      const { network_id } = wallet;
      const contract = this.getWeb3WithProvider(PresaleABI, contract_address, network_id.toString());

      const result = await contract.methods.BUYERS(wallet.wallet_address).call();

      return jsonSuccess(result);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_BUYER_INFO_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * @description Owner claim unsold token
   * @param {Object} wallet
   * @param {Object} project
   */
  async getOwnerClaimData({ wallet, project }) {
    try {
      const { contract_address } = project;
      const contract = this.getWeb3WithProvider(PresaleABI, contract_address, wallet.network_id.toString());

      const ownerWithdrawTokens = contract.methods.ownerWithdrawTokens();
      const gas = await ownerWithdrawTokens.estimateGas({ from: wallet.wallet_address });

      const result = {
        data: ownerWithdrawTokens.encodeABI(),
        gas: Web3.utils.toHex(gas)
      }

      return jsonSuccess(result);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_OWNER_CLAIM_DATA_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * @description Owner claim unsold token
   * @param {Object} wallet
   * @param {Object} project
   */
  async getOwnerRefundData({ wallet, project }) {
    try {
      const { contract_address } = project;
      const contract = this.getWeb3WithProvider(PresaleABI, contract_address, wallet.network_id.toString());

      const ownerRefundTokens = contract.methods.ownerRefundTokens();
      const gas = await ownerRefundTokens.estimateGas({ from: wallet.wallet_address });

      const result = {
        data: ownerRefundTokens.encodeABI(),
        gas: Web3.utils.toHex(gas)
      };

      return jsonSuccess(result);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_OWNER_REFUND_DATA_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * @description Update is_owner_withdrawn in presale table after owner claim success
   * @param {Number} project_id
   * @param {Boolean} is_list_on_uniswap
   * @param {Boolean} is_owner_withdrawn
   */
  async updatePresaleStatus({ project_id, is_list_on_uniswap, is_owner_withdrawn }) {
    try {
      await this.presaleRepository.update(
        { project_id },
        { is_list_on_uniswap, is_owner_withdrawn },
      );

      return jsonSuccess();
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_UPDATE_IS_OWNER_WITHDRAWN_SERVICE`, error);
      throw error;
    }
  }

  /** FUNCTIONS IN SERVICE **/
  getWeb3Instance(abi) {
    const web3Instance = new Web3();
    return new web3Instance.eth.Contract(abi);
  }

  getWeb3(networkId) {
    try {
      const provider = PROVIDERS[networkId];
      if (!provider) {
        throw errors.INVALID_NETWORK;
      }

      return new Web3(Web3.givenProvider || provider);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_WEB3_FUNCTION`, error);
      throw error;
    }
  }

  getWeb3WithProvider(abi, address, networkId) {
    try {
      const web3Instance = this.getWeb3(networkId);
      return new web3Instance.eth.Contract(abi, address);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_WEB3_WITH_PROVIDER_FUNCTION`, error);
      throw error;
    }
  }

  async checkAndStoreWhitelistWallet(sale_id, contractAddress, addresses, transaction) {
    try {
      const web3 = new Web3();
      if (addresses && addresses.length) {
        for (let userAddress of addresses) {
          let checkExisted = await Whitelist.findOne({
            where: {
              sale_id,
              whitelist_wallet_address: userAddress
            },
          });
          let whitelistAttributes = {}
          const message = web3.utils.soliditySha3(contractAddress, userAddress);
          const sign = web3.eth.accounts.sign(message, getEnv('CALLER_PRIV'))
          if (!checkExisted) {
            whitelistAttributes = {
              sale_id,
              whitelist_wallet_address: userAddress,
              v: sign.v,
              r: sign.r,
              s: sign.s
            }
            await this.whitelistRepository.create(whitelistAttributes, transaction);
          } else {
            const { v,r,s, white_list_id } = checkExisted;
            if (!v || !r || !s) {
              await this.whitelistRepository.updateOne(
                {
                  v: sign.v,
                  r: sign.r,
                  s: sign.s
                },
                {
                  white_list_id
                },
                transaction
              )
            }
          }
        }
      }
      return true;
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_CHECK_AND_STORE_WHITELIST_WALLET_FUNCTION`, error);
      throw error;
    }
  }
}

export const presaleService = new PresaleService();
