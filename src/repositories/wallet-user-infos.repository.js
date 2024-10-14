import { Repository } from './Repository'
import { WalletUserInfos } from '../models/schema/wallet-user-infos.model';
import { Wallet } from '../models/schema/wallet.model';

class WalletUserInfosRepository extends Repository {
  constructor() {
    super(WalletUserInfos);
  }

  /**
   * Get list wallet userInfo with wallet address
   *
   */
  async getWalletUserInfosWithAddress() {
    try {
      return this.model.findAll({
        where: {},
        include: [{
          model: Wallet,
          attributes: ["wallet_address"],
          as: "wallet"
        }]
      })
    } catch (e) {
      throw e;
    }
  }
}

export { WalletUserInfosRepository };
