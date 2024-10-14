import { jsonError, errors, logger, jsonSuccess } from '../utils/system';
import { WalletUserInfosRepository } from "../repositories/wallet-user-infos.repository";
import { WalletRepository } from "../repositories/wallet.repository";
import { sequelize } from "../core/boot";

class WalletUserInfosService {
  constructor() {
    this.walletUserInfo = new WalletUserInfosRepository();
    this.walletRepository = new WalletRepository();
  }

  /**
   * @description edit wallet user info
   * @param wallet_id
   * @param display_name
   * @param avatar_url
   */
  async editWalletUserInfo({ wallet_id, display_name, avatar_url }) {
    try {
      const walletUserInfo = await this.walletUserInfo.upsert({ wallet_id, display_name, avatar_url });
      return jsonSuccess(walletUserInfo);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_EDIT_WALLET_USER_INFO`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * @description Get wallet user info
   * @param wallet_id
   */
  async getWalletUserInfo({wallet_id }) {
    try {
      const result = await this.walletUserInfo.getById(wallet_id);

      return jsonSuccess(result);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_WALLET_USER_INFO`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * @description Get list all wallet info
   *
   */
  async getListWalletUserInfos() {
    try {
      const result = await this.walletUserInfo.getWalletUserInfosWithAddress();
      return jsonSuccess(result);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_WALLET_USER_INFO`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * @description Create multi admin wallet
   *
   */
  async createMultiAdminWallet(body) {
    try {
      const { wallets } = body;
      if (wallets && wallets.length) {
        let transaction = await sequelize.transaction();
        for (let item of wallets) {
          const { address, type } = item;
          let walletUserInfo;
          let wallet = await this.walletRepository.getOne({ wallet_address: address });
          if (!wallet) {
            wallet = await this.walletRepository.create({ wallet_address: address, wallet_type: type }, transaction);
            walletUserInfo = await this.walletUserInfo.create({ wallet_id: wallet.wallet_id, is_admin: true }, transaction);
          } else {
            walletUserInfo = await this.walletUserInfo.getOne({ wallet_id: wallet.wallet_id });
            if (!walletUserInfo) {
              walletUserInfo = await this.walletUserInfo.create({ wallet_id: wallet.wallet_id, is_admin: true }, transaction);
            } else {
              if (!walletUserInfo.is_admin)
                await this.walletUserInfo.updateOne({is_admin: true}, {wallet_id: wallet.wallet_id}, transaction)
            }
          }
        }
        if (transaction) {
          await transaction.commit();
        }
      }
      return jsonSuccess(true);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_CREATE_MULTI_ADMIN_WALLET_INFO`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  async updateMultiAdminWallet({ wallets }) {
    let transaction;
    try {
      if (wallets && wallets.length) {
        transaction = await sequelize.transaction();

        const walletData = await this.walletRepository.findAll({
          condition: { wallet_address: wallets },
          attributes: ['wallet_id']
        });

        if (!walletData.length) {
          return jsonError('WALLETS NOT FOUND');
        }

        const walletIds = walletData.map(w => w.wallet_id);

        await this.walletUserInfo.update({
          wallet_id: walletIds,
          is_admin: false
        }, {
          is_admin: true
        }, transaction);

        await transaction.commit();

        return jsonSuccess('UPDATE ADMIN WALLET SUCCESS!');
      }
      return jsonSuccess('NOTHING TO UPDATE!');
    } catch (error) {
      if (transaction) await transaction.rollback();
      logger.error(`${new Date().toDateString()}_ERRORS_UPDATE_MULTI_ADMIN_WALLET_INFO`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }
}

export const walletUserInfosService = new WalletUserInfosService();
