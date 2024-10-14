import pairTokenAbi from "../abi/token-pair.js";
import uniswapRouterAbi from "../abi/uniswap-router.js";
import uniswapLockerAbi from "../abi/uniswap-locker.js";
import {
  PROVIDERS,
  UNISWAP_ROUTERS,
  UNISWAP_LOCKERS,
  PAYMENT_CURRENCIES,
} from "../utils/constants";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import { errors, jsonError, logger, jsonSuccess } from "../utils/system";
import { ProjectRepository } from "../repositories/project.repository";

class LiquidityService {
  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  /**
   * Get liquidity balance
   * @param projectId
   * @returns {Promise<{success: boolean, error: null}|(string|*)[]>}
   */
async getLiquidityBalance({ project_id, wallet }) {
    try {
      const { wallet_address, network_id } = wallet;
      const provider = PROVIDERS[network_id];
      if (!provider) {
        return jsonError(errors.INVALID_NETWORK);
      }

      const project = await this.projectRepository.getById(project_id, {
        attributes: ["pair_address"],
      });
      if (!project) {
        return jsonError(errors.PROJECT_NOT_FOUND);
      }

      const pairAddress = project.pair_address;
      const web3 = new Web3(provider);
      const contract = new web3.eth.Contract(pairTokenAbi, pairAddress);
      const [reserves, balance, totalSupply, decimals, token0, token1] = await Promise.all([
        contract.methods.getReserves().call(),
        contract.methods.balanceOf(wallet_address).call(),
        contract.methods.totalSupply().call(),
        contract.methods.decimals().call(),
        contract.methods.token0().call(),
        contract.methods.token1().call(),
      ]);

      return jsonSuccess([
        new BigNumber(balance)
          .multipliedBy(reserves[0])
          .dividedBy(totalSupply)
          .toString(10),
        new BigNumber(balance)
          .multipliedBy(reserves[1])
          .dividedBy(totalSupply)
          .toString(10),
        balance,
        decimals,
        token0,
        token1,
      ]);
    } catch (error) {
      logger.error(
        `${new Date().toDateString()}_ERRORS_GET_LIQUIDITY_BALANCE_SERVICE`,
        error
      );
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * Withdraw LP Token
   * @param from
   * @param percent
   * @param wallet
   * @param project_id
   * @returns {Promise<{gasLimit: number | BigNumber, data: string}>}
   */
  async withdrawLPToken({ percent, wallet, project_id }) {
    try {
      const { network_id: networkId, wallet_address: from } = wallet;
      const provider = PROVIDERS[networkId];
      if (!provider) {
        return jsonError(errors.INVALID_NETWORK);
      }

      const project = await this.projectRepository.getById(project_id, {
        attributes: ["pair_address"],
      });
      if (!project) {
        return jsonError(errors.PROJECT_NOT_FOUND);
      }

      const pairAddress = project.pair_address;

      const web3 = new Web3(provider);
      const contract = new web3.eth.Contract(
        uniswapLockerAbi,
        UNISWAP_LOCKERS[networkId]
      );

      const data = await contract.methods
        .getUserLockForTokenAtIndex(from, pairAddress, 0)
        .call();
      let amountLiq = data[1];
      amountLiq = new BigNumber(amountLiq)
        .multipliedBy(percent)
        .dividedBy(100)
        .toFixed(0)
        .toString(10);

      const lockIDLiq = data[4];
      const method = contract.methods.withdraw(
        pairAddress,
        0,
        lockIDLiq,
        amountLiq
      );

      return jsonSuccess({
        data: method.encodeABI(),
        gasLimit: await method.estimateGas({ from }),
      });
    } catch (error) {
      logger.error(
        `${new Date().toDateString()}_ERRORS_WITHDRAW_LP_TOKEN_SERVICE`,
        error
      );
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * Withdraw liquidity
   * @param from
   * @param percent
   * @param erc20Token
   * @param deadline
   * @param v
   * @param r
   * @param s
   * @returns {Promise<{success: boolean, error: null}>}
   */
  async withdrawLiquidity({
    erc20_token: erc20Token,
    project_id,
    deadline,
    wallet,
  }) {
    try {
      const { network_id, wallet_address: from } = wallet;
      const provider = PROVIDERS[network_id];
      if (!provider) {
        return jsonError(errors.INVALID_NETWORK);
      }

      const web3 = new Web3(provider);
      const res = await this.getLiquidityBalance({ wallet, project_id });
      let [
        token0Balance,
        token1Balance,
        balance,
        decimals,
        token0,
        token1,
      ] = res.result;

      token0Balance = new BigNumber(token0Balance)
        .multipliedBy(95)
        .dividedBy(100)
        .toFixed(0)
        .toString(10);
      token1Balance = new BigNumber(token1Balance)
        .multipliedBy(95)
        .dividedBy(100)
        .toFixed(0)
        .toString(10);
      balance = new BigNumber(balance)
        .toFixed(0)
        .toString(10);

      const contract = new web3.eth.Contract(
        uniswapRouterAbi,
        UNISWAP_ROUTERS[network_id]
      );
      let method;
      const project = await this.projectRepository.getById(project_id);
      if ([PAYMENT_CURRENCIES.ETH, PAYMENT_CURRENCIES.BNB].includes(project.payment_currency)) {
        if (token0.toLowerCase() === project.token_contract_address.toLowerCase()) {
          method = contract.methods.removeLiquidityETH(
            erc20Token,
            balance,
            token0Balance,
            token1Balance,
            from,
            deadline,
          );
        } else {
          method = contract.methods.removeLiquidityETH(
            erc20Token,
            balance,
            token1Balance,
            token0Balance,
            from,
            deadline,
          );
        }
      } else {
        method = contract.methods.removeLiquidity(
          token0,
          token1,
          balance,
          token0Balance,
          token1Balance,
          from,
          deadline,
        );
      }

      return jsonSuccess({
        data: method.encodeABI(),
        gasLimit: await method.estimateGas({ from }),
      });
    } catch (error) {
      logger.error(
        `${new Date().toDateString()}_ERRORS_WITHDRAW_LIQUIDITY_SERVICE`,
        error
      );
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  async call() {
    // const balances = await getLiquidityBalance(
    //   "0xe3ffA802AcD08a618cFe548d119646Cd0b842d8C",
    //   "0xa84fB214aB9250c0be7312C9FFa6275F6746bee4",
    //   "4"
    // );
    // console.log({ balances });
    // const deadline = Math.round(new Date().getTime()/1000) + 3600;
    const deadline = 1627415315;
    const res = await withdrawLiquidity(
      "0xa84fB214aB9250c0be7312C9FFa6275F6746bee4",
      25,
      "0x82bAA84D226Ea411C8796fA1E44ABfBBB6Aa6c09",
      "0xe3ffA802AcD08a618cFe548d119646Cd0b842d8C",
      deadline,
      "4"
    );
    console.log({ res });
  }
}

export const liquidityService = new LiquidityService();
