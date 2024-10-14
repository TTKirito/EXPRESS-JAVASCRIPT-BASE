import BigNumber from 'bignumber.js';
import moment from 'moment';
import { Sequelize } from 'sequelize';
import { sequelize } from '../core/boot';
import { Presale } from '../models/schema/presale.model';
import { calculateTotalTokensSold, Project, TOKEN_SALE_TYPE } from '../models/schema/project.model';
import { ACCESS_TYPE, Sale } from '../models/schema/sale.model';
import { Wallet } from '../models/schema/wallet.model';
import { Whitelist } from '../models/schema/whitelist.model';
import { PresaleRepository } from '../repositories/presale.repository';
import { ProjectRepository } from '../repositories/project.repository';
import { SaleRepository } from '../repositories/sale.repository';
import { TransactionRepository } from '../repositories/transaction.repository';
import { WhitelistRepository } from '../repositories/whitelist.repository';
import { apiGet, getOption } from '../utils/request';
import { errors, jsonError, jsonSuccess, logger } from '../utils/system';
import { presaleService } from './presale.service';
import { ProjectDraftRepository } from '../repositories/project-draft.repository';
import { FeaturedTokenRepository } from '../repositories/featured-token.repository';
import { WalletRepository } from '../repositories/wallet.repository';
import { ProjectPitchRepository } from '../repositories/project-pitch.repository';
import { ProjectPitch } from '../models/schema/project-pitch.model';
import { farmService } from './farm.service';
import {TokenRepository} from "../repositories/token.repository";
import { FollowRepository } from '../repositories/follow.repository';
import { Follow } from '../models/schema/follow.model';
import { UnderstandRepository } from "../repositories/understand.repository";
import { Understand } from '../models/schema/understand.model';
import { TokenMetricsRepository } from "../repositories/token-metrics.repository";


const { Op } = Sequelize;

class ProjectService {
  constructor() {
    this.projectRepository = new ProjectRepository();
    this.saleRepository = new SaleRepository();
    this.whitelistRepository = new WhitelistRepository();
    this.transactionRepository = new TransactionRepository();
    this.presaleRepository = new PresaleRepository();
    this.projectDraftRepository = new ProjectDraftRepository();
    this.featuredTokenRepository = new FeaturedTokenRepository();
    this.walletRepository = new WalletRepository();
    this.projectPitchRepository = new ProjectPitchRepository();
    this.tokenRepository = new TokenRepository();
    this.followRepository = new FollowRepository();
    this.understandRepository = new UnderstandRepository()
    this.tokenMetricsRepository = new TokenMetricsRepository()
  }

  /**
   * @description create project service
   */
  async createProject(
    {
      wallet,
      /** Project */
      project_logo,
      project_image,
      project_name,
      project_website,
      project_email,
      project_white_paper,
      project_additional_info,
      project_twitter,
      project_telegram,
      project_medium,
      project_discord,
      token_contract_address,
      token_name,
      token_symbol,
      token_decimal,
      payment_currency,
      list_amm,
      currency_pair,
      contract_address,
      project_sub_title,
      sale_round_launch,
      /** Sale */
      wallet_token_balance,
      sale_allocation,
      swap_ratio,
      hard_cap,
      soft_cap,
      max_allocation_wallet_limit,
      max_allocation_wallet,
      min_allocation_wallet_limit,
      min_allocation_wallet,
      access_type,
      sale_start_time,
      sale_end_time,
      listing_rate,
      initial_liquidity_per,
      listing_time,
      lock_liquidity,
      est_funding,
      //TODO Fields still waiting  for validate
      distribution_type,
      distribution_date,
      distribution_interval,
      distribution_interval_period,
      first_unlock_rate,
      unlock_rate,
      /** Project pitch */
      project_pitches,
      /** White list */
      whitelist,
      whitelist_address_csv,
    }
  ) {
    let transaction;
    let isFirstTokenSale = false;
    try {
      // const isContractAddressSuccessOrLiveUpcoming = await this.checkIsContractAddressSuccessOrLiveUpcoming(token_contract_address);
      // if (isContractAddressSuccessOrLiveUpcoming) {
      //   return jsonError(errors.CONTRACT_ADDRESS_IS_LIVE_OR_UPCOMING);
      // }

      const checkFirstTime = await this.projectRepository.findAll({ condition: { wallet_id: wallet.wallet_id }});

      if (!checkFirstTime.length || checkFirstTime.length === 0) {
        //TODO import NFT
        isFirstTokenSale = true;
      }

      const projectsOfToken = await this.projectRepository.findAll({
        condition: { token_contract_address },
        include: [
          {
            model: Sale,
            as: 'sale',
          }
        ],
        order: [['created_at', 'ASC']]
      });

      let listingRate = listing_rate;
      let listingTime = listing_time;
      let lockLiquidity = lock_liquidity;

      // sale_start_time is before sale_end_time
      if (!moment(sale_end_time).isAfter(sale_start_time))
        return jsonError(errors.START_TIME_MUST_BE_BEFORE_END_TIME);
      let round = (projectsOfToken && projectsOfToken.length || 0 ) + 1;
      if (round !== 1) {
        // validate create token sale từ 2nd onwards
        // keep some parameters of 1st round for 2nd onwards {listing_rate, listing_time, lock_liquidity}
        const firstProject = projectsOfToken.find(item => item.round === 1) || projectsOfToken[0];
        listingRate = firstProject && firstProject.sale.listing_rate;
        listingTime = firstProject && firstProject.sale.listing_time;
        lockLiquidity = firstProject && firstProject.sale.lock_liquidity;
        const setEndTime = projectsOfToken.map(item => {
          return item.sale && item.sale.sale_end_time
        });

        // time of specific round is not duplicate
        const checkTime = setEndTime.some(item => moment(new Date(sale_start_time)).isBefore(moment(item)));
        if (checkTime)
          return jsonError(errors.START_TIME_OF_NEXT_TIME_MUST_BE_AFTER_END_TIME_OF_THE_PREVIOUS);
      }
      // sale_start_time is before listing time (for the 2nd round onwards, the listing time is understood as the listing time set in 1st round)
      if (!moment(listingTime).isAfter(sale_start_time))
        return jsonError(errors.START_TIME_MUST_BE_BEFORE_LISTING_TIME);

      const isFeaturedProject = await this.featuredTokenRepository.getOne({ token_contract_address });

      transaction = await sequelize.transaction();

      const project = await this.projectRepository.create({
        wallet_id: wallet.wallet_id,
        // network_id: wallet.network_id,
        project_logo,
        project_image,
        project_name,
        project_website,
        project_email,
        project_white_paper,
        project_additional_info,
        project_twitter,
        project_telegram,
        project_medium,
        project_discord,
        token_contract_address,
        token_name,
        token_symbol,
        token_decimal,
        payment_currency,
        list_amm,
        currency_pair,
        contract_address,
        project_sub_title,
        sale_round_launch,
        round,
        whitelist_address_csv,
        is_featured_project: !!isFeaturedProject,
      }, transaction);

      let saleAttributes = {
        project_id: project.project_id,
        wallet_token_balance,
        sale_allocation: sale_allocation.toString(),
        swap_ratio: swap_ratio.toString(),
        hard_cap: hard_cap.toString(),
        soft_cap: soft_cap.toString(),
        max_allocation_wallet_limit,
        max_allocation_wallet: max_allocation_wallet_limit && max_allocation_wallet,
        min_allocation_wallet_limit,
        min_allocation_wallet: min_allocation_wallet_limit && min_allocation_wallet,
        access_type,
        sale_start_time,
        sale_end_time,
        listing_rate: listingRate,
        initial_liquidity_per,
        listing_time: listingTime,
        lock_liquidity: lockLiquidity,
        est_funding,
      }
      // TODO Check distribution_date with case already setting token metrics
      /** Check for distribution type */
      if (distribution_date) {
        saleAttributes = {
          ...saleAttributes,
          distribution_type,
          distribution_date,
          first_unlock_rate,
          distribution_interval,
          distribution_interval_period,
          unlock_rate,
        }
      }

      const sale = await this.saleRepository.create(saleAttributes, transaction);

      /** Project pitch */
      if (project_pitches && project_pitches.length) {
        const projectPitchAttributes = project_pitches.map(pitch => {
          return {
            project_id: project.project_id,
            uploaded_video: pitch.uploaded_video,
            heading_title: pitch.heading_title,
            navigation_title: pitch.navigation_title,
            content: pitch.content,
            order: pitch.order,
            display: pitch.display,
          }
        })

        await this.projectPitchRepository.bulkCreate(projectPitchAttributes, transaction)
      }

      /** Insert white_lists when access type is private only */
      if (access_type === ACCESS_TYPE.PRIVATE && whitelist.length) {
        await presaleService.checkAndStoreWhitelistWallet(sale.sale_id, project.contract_address, whitelist, transaction);
        // const whitelistAttributes = whitelist.map(item => {
        //   return {
        //     sale_id: sale.sale_id,
        //     whitelist_wallet_address: item,
        //   }
        // });
        //
        // await this.whitelistRepository.bulkCreate(whitelistAttributes, transaction);
      }

      // increase num_of_round when create multi token sale
      const token = await this.tokenRepository.getOne({ token_contract_address });
      if (token) {
        let numOfRound = Number(token.num_of_round || 0) + 1;
        await this.tokenRepository.update({
          token_contract_address
        }, {
          num_of_round: numOfRound
        }, transaction)
      }
      await transaction.commit();

      if (isFirstTokenSale) {
        // add NFT Farm
        console.log('create farm');

        const res = await farmService.createDALFarm({
          wallet,
          project_id: project.project_id
        });
        console.log({ res });
      }

      return jsonSuccess();
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      logger.error(`${new Date().toDateString()}_ERRORS_CREATE_PROJECT_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * @description Get list project service
   * @param {Object|null} wallet
   * @param {string} time
   * @param {string} get_my_project
   * @param {Boolean} get_featured_project
   * @param token_contract_address
   * @param sort_type
   */
  async getListProject({ wallet = null }, { time = '', get_my_project, get_featured_project = false, token_contract_address , sort_type, page, limit }) {
    try {
      const condition = { is_featured_project: !!get_featured_project };
      const includes = [
        {
          model: Sale,
          as: 'sale'
        },
        {
          model: Presale,
          as: 'presale'
        },
        {
          model: Follow,
          as: 'follows',
          attributes: ['project_id', 'wallet_id'],
          separate: true,
        },
        {
          model: Understand,
          as: 'understands',
          attributes: ['project_id', 'wallet_id'],
          separate: true,
        },
        {
          model: ProjectPitch,
          as: 'project_pitches',
          separate: true,
        },

      ];
      const now = new Date();
      let order;

      /** If get my project */
      if (get_my_project === 'true') {
        if (!wallet) {
          return jsonError(errors.NOT_AUTHENTICATED_ERROR);
        }

        delete condition.is_featured_project;
        condition.wallet_id = wallet.wallet_id;
        // condition.network_id = wallet.network_id;
      } else {
        /** Network condition */
        if (!wallet) {
          // /** Get main network project if not logged-in */
          // condition.network_id = { [Op.in]: NETWORK_TYPE.MAINS };
          return jsonSuccess({
            count: 0,
            rows: []
          });
        } else if (wallet.network_id) {
          /** Get chose network project if logged-in */
          // condition.network_id = wallet.network_id;
          includes.push({
            model: Wallet,
            as: 'wallet',
            attributes: ['network_id'],
            where: { network_id: wallet.network_id }
          })
        }

        /** Time condition (upcoming, live, close) */
        switch (time) {
          case TOKEN_SALE_TYPE.LIVE:
            condition['$sale.sale_start_time$'] = { [Op.lte]: moment(now).toDate() };
            condition['$sale.sale_end_time$'] = { [Op.gte]: now };
            break;
          case TOKEN_SALE_TYPE.UPCOMING:
            condition['$sale.sale_start_time$'] = { [Op.gte]: moment(now).toDate() };
            break;
          case TOKEN_SALE_TYPE.LIVE_AND_UPCOMING:
            condition['$sale.sale_end_time$'] = { [Op.gt]: now };
            order = [['sale', 'sale_start_time', 'ASC']];
            break;
          case TOKEN_SALE_TYPE.CLOSED:
            condition['$sale.sale_end_time$'] = { [Op.lte]: now };
            break;
          default:
            break;
        }
      }
      if (token_contract_address) {
        condition.token_contract_address = token_contract_address;
      }

      const option = getOption({ sort_type, page, limit }, order)
      option.attributes = Object.keys(Project.rawAttributes).concat([
        [sequelize.literal(`
          (SELECT COUNT(*) FROM (
              SELECT farm_id FROM nft_added_farms
              UNION ALL
              SELECT farm_id FROM nft_shopping_farms
            ) as nft_farms
          INNER JOIN farms ON nft_farms.farm_id = farms.farm_id
          WHERE farms.project_id = project.project_id)
          `), 'total_nfts'
        ]
      ])
      option.include = includes
      const result = await this.projectRepository.getListDataAndCountByCondition(
        condition,
        option        
      ).then(res => JSON.parse(JSON.stringify(res)));

      const projectStatuses = await Promise.all(
        result.rows.map(project => {
          if (project.presale) {
            return null;
          }

          return presaleService.getPresaleStatus({
            contract_address: project.contract_address,
            network_id: wallet.network_id,
            project_id: project.project_id,
          });
        })
      );

      result.rows.forEach((project, index) => {
        if (!project.presale) {
          const status = projectStatuses[index];
          project.presale = status.success ? status.result : null
        }

        if (now >= moment(project.sale.sale_end_time)) {
          project.isClosed = true;
        }
      });

      result.current_server_time = new Date()

      return jsonSuccess(result);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_LIST_PROJECT_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * @description Get project by id
   */
  async getProjectById({ id }, { wallet }) {
    try {
      const result = await this.projectRepository.getById(id, {
        attributes: Object.keys(Project.rawAttributes).concat([
          [sequelize.literal(`
            (SELECT COUNT(*) FROM (
                SELECT farm_id FROM nft_added_farms
                UNION ALL
                SELECT farm_id FROM nft_shopping_farms
              ) as nft_farms
            INNER JOIN farms ON nft_farms.farm_id = farms.farm_id
            WHERE farms.project_id = project.project_id)
            `), 'total_nfts'
          ]
        ]),
        include: [
          {
            model: Sale,
            as: 'sale',
            include: {
              model: Whitelist,
              as: 'white_lists'
            }
          },
          {
            model: Wallet,
            as: 'wallet'
          },
          {
            model: Presale,
            as: 'presale'
          },
          {
            model: ProjectPitch,
            as: 'project_pitches',
          },
          {
            model: Follow,
            as: 'follows',
            attributes: ['project_id', 'wallet_id']
          },
          {
            model: Understand,
            as: 'understands',
            attributes: ['project_id', 'wallet_id']
          }
        ]
      });

      if (!result) {
        return jsonError(errors.PROJECT_NOT_FOUND);
      }

      if (!result.presale) {
        const projectStatus = await presaleService.getPresaleStatus({
          contract_address: result.contract_address,
          network_id: wallet.network_id,
          project_id: result.project_id,
        });

        result.presale = projectStatus.success ? projectStatus.result : null;
      }
      const token = await this.tokenRepository.getOne({token_contract_address: result.token_contract_address});
      let tokenMetrics = [];
      if (token) {
        tokenMetrics = await this.tokenMetricsRepository.findAll({
          condition: {
            token_id: token.token_id
          }
        });
      }
      result.tokenMetrics = tokenMetrics;

      const listProjects = await this.projectRepository.findAll({
        condition: {token_contract_address: result.token_contract_address},
        include: [
          {
            model: Sale,
            as: 'sale'
          },
          {
            model: Presale,
            as: 'presale'
          },
        ],
      });
      result.listProjects = listProjects || [];
      result.current_server_time = new Date()
      return jsonSuccess(result);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_PROJECT_BY_ID_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * @description Save transaction history
   * @param wallet {Object}
   * @param project_id {Number}
   */
  async saveTransaction({ wallet, project_id }) {
    try {
      const existedTransaction = await this.transactionRepository.getOne({
        wallet_id: wallet.wallet_id,
        project_id,
      })
      if (!existedTransaction) {
        await this.transactionRepository.create({
          wallet_id: wallet.wallet_id,
          project_id,
        });
      }

      return jsonSuccess();
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_SAVE_TRANSACTION_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * @description Get participated project list
   */
  async getParticipatedProjectList({ wallet }, { page, limit }) {
    try {
      const distinctParticipatedProjectIds = await this.transactionRepository.findAll({
        page: +page,
        limit: +limit,
        attributes: ['project_id'],
        group: ['project_id'],
        condition: {
          wallet_id: wallet.wallet_id,
          // '$project.network_id$': wallet.network_id,
        },
        include: {
          model: Project,
          as: 'project',
        },
        order: []
      });

      const result = await this.projectRepository.getAll({
        page: +page,
        limit: +limit,
        condition: { project_id: { [Op.in]: distinctParticipatedProjectIds.map(item => item.project_id) } },
        include: [
          {
            model: Sale,
            as: 'sale'
          },
          {
            model: Presale,
            as: 'presale'
          },
        ]
      }).then(res => JSON.parse(JSON.stringify(res)));

      const buyers = await Promise.all(
        result.rows.map(project => presaleService.getBuyerInfo({
          wallet,
          project,
        }))
      );

      const projectStatuses = await Promise.all(
        result.rows.map(item => {
          if (item.presale) {
            return null
          }

          return presaleService.getPresaleStatus({
            contract_address: item.contract_address,
            network_id: wallet.network_id,
          })
        })
      );

      result.rows.forEach((item, index) => {
        item.buyer = buyers[index].result;
        if (!item.presale) {
          item.presale = projectStatuses[index].success ? projectStatuses[index].result : null;
        }
      });

      result.current_server_time = new Date()
      return jsonSuccess(result);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_PARTICIPATED_PROJECTS_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * @description Get my project statistic
   * @param wallet
   */
  async getStatistic({ wallet }) {
    try {
      const condition = {
        wallet_id: wallet.wallet_id,
        // network_id: wallet.network_id,
      }

      const projects = await this.projectRepository.findAll({
        condition,
        include: [
          {
            model: Sale,
            as: 'sale',
          },
          {
            model: Presale,
            as: 'presale',
          }
        ]
      }).then(res => JSON.parse(JSON.stringify(res)));

      const presales = await Promise.all(
        projects.map(project => {
          if (project.presale) {
            return null;
          }

          return presaleService.getPresaleStatus({
            contract_address: project.contract_address,
            network_id: wallet.network_id,
            project_id: project.project_id,
          });
        })
      );

      const prices = await Promise.all(
        projects.map((project, index) => {
          if (project.presale) {
            return null;
          }

          return this.getProjectPrice({
            payment_currency: project.payment_currency,
            amount: presales[index].success ? presales[index].result.total_base_collected : 0,
          })
        })
      );

      let participants = 0;
      const totalProjects = {
        closed: 0,
        success: 0,
        liveAndUpcoming: 0,
      };

      const now = moment().valueOf();

      projects.forEach((project, index) => {
        if (!project.presale) {
          const findPresale = presales[index];
          project.presale = findPresale.success ?
            {
              ...findPresale.result,
              price: prices[index],
            }
            :
            null;
        }

        const { number_buyers = 0, total_base_collected = 0 } = project.presale || {};
        participants += +number_buyers;
        if (now >= moment(project.sale.sale_end_time)) {
          project.isClosed = true;
          totalProjects.closed += 1;

          const totalTokenSold = calculateTotalTokensSold(project.payment_currency, total_base_collected);
          const softCap = +project.sale.soft_cap;
          if (totalTokenSold >= softCap) {
            totalProjects.success += 1;
            project.is_success = true;
          } else {
            project.is_success = false;
          }
        } else {
          totalProjects.liveAndUpcoming += 1;
        }
      })

      /** Save presale status into database if project closed */
      await this.savePresaleIntoDatabase({
        projects,
        presales,
      });

      const totalFunding = projects.reduce((res, project) => project.presale && project.is_success
        ? new BigNumber(res).plus(project.presale.price)
        : res
        , 0);

      return jsonSuccess({
        participants,
        totalProjects,
        totalFunding,
      })
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_STATISTIC_PROJECTS_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * @description Create or update project draft
   * @param {Object} wallet
   * @param {Object} data
   * @param type
   */
  async createOrUpdateProjectDraft({ wallet, data, type }) {
    try {
      const dataInsert = JSON.stringify(data);
      const draft = await this.projectDraftRepository.getOne({
        wallet_id: wallet.wallet_id,
        type,
        network_id: wallet.network_id,
      });
      if (draft) {
        await this.projectDraftRepository.updateById(draft.project_draft_id, { data: dataInsert });
      } else {
        await this.projectDraftRepository.create({
          wallet_id: wallet.wallet_id,
          type,
          network_id: wallet.network_id,
          data: dataInsert,
        });
      }

      return jsonSuccess();
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_CREATE_PROJECT_DRAFT_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * @description Get project draft
   * @param {Object} wallet
   */
  async getProjectDraft({ wallet }, { type }) {
    try {
      const result = await this.projectDraftRepository.getOne({
        wallet_id: wallet.wallet_id,
        type,
        network_id: wallet.network_id,
      })

      if (result && result.data) {
        return jsonSuccess(JSON.parse(result.data))
      }

      return jsonSuccess(null);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_PROJECT_DRAFT_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * @description Clear project draft
   * @param {Object} wallet
   */
  async clearProjectDraft({ wallet, type }) {
    try {
      const cleanProjectDraftCondition = {
        wallet_id: wallet.wallet_id,
        network_id: wallet.network_id,
      }
      if (type) {
        cleanProjectDraftCondition.type = type
      }

      await this.projectDraftRepository.delete(cleanProjectDraftCondition);

      return jsonSuccess();
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_CLEAR_PROJECT_DRAFT_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * @description Understand project
   * @param {Object} wallet
   */
   async understandProject({ wallet }) {
    try {
      // doing
      await this.walletRepository.updateById(
        wallet.wallet_id,
        { is_understood_project: true },
      );

      return jsonSuccess();
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_UNDERSTAND_PROJECT_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  async understandProjectByProjectId(project_id, wallet_id) {
    try {

      const result = await this.projectRepository.getById(project_id);

      if (!result) {
        return jsonError(errors.PROJECT_NOT_FOUND);
      }

      const understand = await this.understandRepository.getOne(
        { project_id, wallet_id }
      );

      if (understand) {
        return jsonError(errors.PROJECT_IS_UNDERSTAND);
      }

      await this.understandRepository.create({
        wallet_id,
        project_id
      });

      return jsonSuccess({ message: 'UNDERSTAND_PROJECT_SUCCESS'});
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_UNDERSTAND_PROJECT_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /********** FUNCTIONS IN SERVICE **********/

  /**
   * @description Save presale status into database (project must include isClosed field)
   * @param {Array<Project>} projects
   * @param {Array<{ success: boolean, result: Object, error: Object }>}  presales
   */
  async savePresaleIntoDatabase({ projects, presales }) {
    const transaction = await sequelize.transaction();
    try {
      await Promise.all(
        presales.reduce((arr, cur, index) => {
          if (cur && cur.success) {
            const responsePresale = cur.result;

            const findProject = projects[index];

            if (findProject && findProject.isClosed) {
              arr.push(this.presaleRepository.create({
                project_id: responsePresale.project_id,
                total_tokens_sold: responsePresale.TOTAL_TOKENS_SOLD,
                total_base_collected: responsePresale.TOTAL_BASE_COLLECTED,
                number_buyers: responsePresale.NUM_BUYERS,
                is_added_liquidity: responsePresale.ADDED_LIQUIDITY,
                is_force_failed: responsePresale.FORCE_FAILED,
                is_transferred_fee: responsePresale.IS_TRANSFERED_FEE,
                is_list_on_uniswap: responsePresale.LIST_ON_UNISWAP,
                total_base_withdrawn: responsePresale.TOTAL_BASE_WITHDRAWN,
                total_tokens_withdrawn: responsePresale.TOTAL_TOKENS_WITHDRAWN,
                is_whitelist_only: responsePresale.WHITELIST_ONLY,
                is_owner_withdrawn: responsePresale.IS_OWNER_WITHDRAWN,
                price: findProject.presale.price,
                is_success: findProject.is_success,
              }, transaction))
            }
          }

          return arr;
        }, [])
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      logger.error(`${new Date().toDateString()}_ERRORS_SAVE_PRESALES_FUNCTION`, error);
      throw error;
    }
  }

  /**
   * @description Get current ratio to get price
   * @param payment_currency
   * @param amount
   */
  async getProjectPrice({ payment_currency, amount }) {
    try {
      if (amount === '0') return 0;
      let decimals = payment_currency === 'USDT' ? 6 : 18;
      decimals = new BigNumber(10).pow(decimals);

      amount = new BigNumber(amount).dividedBy(decimals).toString(10);
      const url = `https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount=${amount}&symbol=${payment_currency}`;
      const headers = { ['X-CMC_PRO_API_KEY']: 'f6eae3aa-42ca-4c7b-848e-0381f4aa76ff' };
      const request = await apiGet({ url, headers });
      return request.data && request.data.quote && request.data.quote.USD && request.data.quote.USD.price || 0;
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_GET_PROJECT_PRICE_FUNCTION`, error);
      throw error;
    }
  }

  /**
   * @description Check is contract address is sold and upcoming/live or success
   * @param {String} token_contract_address
   * @param wallet
   */
  async checkIsContractAddressSuccessOrLiveUpcoming(token_contract_address, wallet) {
    try {
      const successOrLiveUpcomingProjects = await this.projectRepository.findAll({
        condition: {
          token_contract_address,
        },
        include: [
          {
            model: Sale,
            as: 'sale',
          },
          {
            model: Presale,
            as: 'presale',
          },
        ],
      }).then(res => JSON.parse(JSON.stringify(res)));

      const now = moment.utc().format();

      let result = false;
      for (const project of successOrLiveUpcomingProjects) {
        if (moment(project.sale.sale_end_time).isAfter(now)) {
          result = true;
          break;
        } else {
          if (project.presale) {
            if (project.presale.is_success) {
              result = true;
            }
          } else {
            const presale = await presaleService.getPresaleStatus({
              contract_address: project.contract_address,
              network_id: wallet.network_id,
            });
            if (!presale.success) {
              result = true;
              break;
            }

            const { TOTAL_BASE_COLLECTED } = presale.result;

            const totalTokenSold = calculateTotalTokensSold(project.payment_currency, TOTAL_BASE_COLLECTED);
            const softCap = +project.sale.soft_cap;
            if (totalTokenSold >= softCap) {
              result = true;
              break;
            }
          }
        }
      }

      return result;
    } catch (error) {
      logger.error(`${new Date().toDateString()}_ERRORS_CHECK_IS_CONTRACT_ADDRESS_SUCCESS_OR_LIVE_UPCOMING_FUNCTION`, error);
      throw error;
    }
  }

  /**
   * @description Follow project
   * @param project_id {Number}
   * @param wallet_id
   */
  async followProject(project_id, wallet_id) {
    let transaction;

    try {
      const result = await this.projectRepository.getById(project_id);

      if (!result) {
        return jsonError(errors.PROJECT_NOT_FOUND);
      }

      const existedFollow = await this.followRepository.getOne({
        wallet_id,
        project_id,
      })
      transaction = await sequelize.transaction();
      let follow_number;


      if (existedFollow) {
        await this.followRepository.delete({ wallet_id, project_id }, transaction)
        follow_number = result.follow_number -= 1
      } else {
        follow_number = result.follow_number += 1
        await this.followRepository.create({ wallet_id, project_id }, transaction);
      }

      await this.projectRepository.updateById(project_id, { follow_number } , transaction)
      await transaction.commit();
      return jsonSuccess();
    } catch (error) {

      if (transaction) {
        await transaction.rollback();
      }

      logger.error(`${new Date().toDateString()}_ERRORS_FOLLOW_PROJECT_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
   * @description update project info
   * @param project_id {Number}
   * @param wallet_id
   * @param body
   */
  async updateProjectInfo(project_id, wallet_id, body) {
    let transaction;

    try {
      const result = await this.projectRepository.getById(project_id,{
        include: [
          {
            model: Sale,
            as: 'sale',
            include: {
              model: Whitelist,
              as: 'white_lists'
            }
          },
        ]
      });

      if (!result) {
        return jsonError(errors.PROJECT_NOT_FOUND);
      }

      if (result.wallet_id !== wallet_id) {
        return jsonError(errors.NOT_HAVE_ACCESS);
      }

      transaction = await sequelize.transaction();
      const { sale_id } = result.sale
      const { whitelist } = body

      await this.projectRepository.updateById(project_id, body, transaction)

      if (sale_id && whitelist && whitelist.length > 0) {
        await this.whitelistRepository.delete({ sale_id }, transaction)
        await presaleService.checkAndStoreWhitelistWallet(sale_id, result.contract_address, whitelist, transaction);
      }

      await transaction.commit();

      return jsonSuccess({ message: 'UPDATE_PROJECT_INFO_SUCCESS' })
    } catch (error) {

      if (transaction) {
        await transaction.rollback();
      }

      logger.error(`${new Date().toDateString()}_ERRORS_UPDATE_PROJECT_INFO_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }

  /**
  * @description update project pitch
  * @param project_id {Number}
  */
  async updateProjectPitch(project_id, wallet_id, body) {
    let transaction;

    try {
      const result = await this.projectRepository.getById(project_id)

      if (!result) {
        return jsonError(errors.PROJECT_NOT_FOUND);
      }

      if (result.wallet_id !== wallet_id) {
        return jsonError(errors.NOT_HAVE_ACCESS);
      }

      if (body.length !== 0) {
        transaction = await sequelize.transaction();

        await Promise.all(body.map(async (data) => {
          const { project_pitch_id } = data
          const pitch = await this.projectPitchRepository.getOne({ project_pitch_id, project_id }, transaction)
          delete data.project_pitch_id
          delete data.project_id
          if (Object.keys(data).length !==0 && pitch) {
            await this.projectPitchRepository.updateById(project_pitch_id, data, transaction)
          }
        })) 
        await transaction.commit();
      }   

      return jsonSuccess()
    } catch (error) {

      if (transaction) {
        await transaction.rollback();
      }

      logger.error(`${new Date().toDateString()}_ERRORS_UPDATE_PROJECT_PITCH_SERVICE`, error);
      return jsonError(errors.SYSTEM_ERROR);
    }
  }
}

export const projectService = new ProjectService();
