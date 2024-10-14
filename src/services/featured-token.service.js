import {sequelize} from "../core/boot";
import { errors, jsonError, jsonSuccess, logger } from '../utils/system';
import { FeaturedTokenRepository } from '../repositories/featured-token.repository';
import { ProjectRepository } from "../repositories/project.repository";

class FeaturedTokenService {
  constructor() {
    this.featuredTokenRepository = new FeaturedTokenRepository();
    this.projectRepository = new ProjectRepository();
  }

  /**
   * @description Add featured token
   * @param {Object} wallet
   * @param {String} token_name
   * @param {String} token_symbol
   * @param {String} token_contract_address
   */
  async addFeaturedToken({ wallet, token_name, token_symbol, token_contract_address }) {
    let transaction;
    try {
      const isExisted = await this.featuredTokenRepository.getOne({ token_contract_address });

      if (isExisted) {
        return jsonError(errors.TOKEN_CONTRACT_ADDRESS_EXISTED);
      }

      transaction = await sequelize.transaction();

      await Promise.all([
        this.featuredTokenRepository.create({
            token_name,
            token_symbol,
            token_contract_address,
          },
          transaction
        ),
        this.projectRepository.update({
          token_contract_address
        }, {
          is_featured_project: true
        }, transaction)
      ]);

      await transaction.commit();

      return jsonSuccess();
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      logger.error(`${new Date().toDateString()}_ERRORS_ADD_FEATURED_TOKEN_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * @description Delete featured token
   * @param {Number} id
   */
  async deleteFeaturedToken({ id }) {
    let transaction;
    try {
      const featureToken = await this.featuredTokenRepository.getById(id);

      if (!featureToken) {
        return jsonError(errors.INVALID_TOKEN);
      }
      transaction = await sequelize.transaction();

      await Promise.all([
        this.featuredTokenRepository.delete({ token_id: id }, transaction),
        this.projectRepository.update({
          token_contract_address: featureToken.token_contract_address
        }, {
          is_featured_project: false
        }, transaction)
      ]);

      await transaction.commit();

      return jsonSuccess();
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      logger.error(`${new Date().toDateString()}_ERRORS_DELETE_FEATURED_TOKEN_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * @description Get featured project
   * @param {Number} page
   * @param {Number} limit
   */
  async getFeaturedTokens({ page, limit }) {
    try {
      const result = await this.featuredTokenRepository.getAll({
        page: +page,
        limit: +limit,
      });

      return jsonSuccess(result);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_FEATURED_TOKEN_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**** FUNCTIONS IN SERVICE ******/

}

export const featuredTokenService = new FeaturedTokenService();
