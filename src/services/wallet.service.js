import { jsonError, errors, logger, jsonSuccess } from '../utils/system';
import { Sequelize } from 'sequelize';
import { WalletRepository } from '../repositories/wallet.repository';
import { Jwt } from '../utils/jwt';
import { sequelize } from '../core/boot';
import { WalletUserInfos } from '../models/schema/wallet-user-infos.model';
import { WalletUserInfosRepository } from "../repositories/wallet-user-infos.repository";

const { Op } = Sequelize;

class WalletService {
  constructor() {
    this.walletRepository = new WalletRepository();
    this.walletUserInfoRepository = new WalletUserInfosRepository();
  }

  /**
   * @description Save wallet and generate token
   */
  async saveWalletAndGenerateToken({ wallet_address, wallet_type = 'ETH', network_id }) {
    let transaction;
    try {
      let wallet = await this.walletRepository.getOne({ wallet_address, network_id });
      let walletUserInfo;
      let isAdmin = false;

      transaction = await sequelize.transaction();

      if (!wallet) {
        wallet = await this.walletRepository.create({
          wallet_address,
          wallet_type,
          network_id
        }, transaction);

        await this.walletUserInfoRepository.create({
          wallet_id: wallet.wallet_id,
          is_admin: false
        }, transaction);
      } else {
        walletUserInfo = await this.walletUserInfoRepository.getOne({ wallet_id: wallet.wallet_id });

        if (!walletUserInfo || (walletUserInfo && !walletUserInfo.is_admin)) {
          await this.walletUserInfoRepository.upsert({
            wallet_id: wallet.wallet_id,
            is_admin: false
          }, transaction);
        } else {
          isAdmin = walletUserInfo.is_admin
        }
      }

      const token = await Jwt.sign({
        wallet_id: wallet.wallet_id,
        wallet_address: wallet.wallet_address,
        wallet_type: wallet.wallet_type,
        network_id,
        isAdmin
      });

      if (transaction) {
        await transaction.commit();
      }

      return jsonSuccess({
        token,
        chainId: network_id,
        isAdmin,
      });
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      logger.error(`${new Date().toDateString()}_ERRORS_SAVE_WALLET_AND_GENERATE_TOKEN_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * We must find again to update status of understand project
   * @description Get my wallet
   * @param {Object} wallet
   */
  async getMyWallet({ wallet }) {
    try {
      const result = await this.walletRepository.getOne({
        wallet_id: wallet.wallet_id,
      }, {
        include: {
          model: WalletUserInfos,
          as: 'wallet_user_info',
          attributes: ['display_name', 'avatar_url'],
        },
      });

      return jsonSuccess(result);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_MY_WALLET_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }
}

export const walletService = new WalletService();
