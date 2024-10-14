'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('farms', {
      farm_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      project_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'projects',
          key: 'project_id'
        }
      },
      wallet_farm_owner: {
        type: Sequelize.INTEGER,
        references: {
          model: 'wallets',
          key: 'wallet_id'
        }
      },
      token_symbol: {
        type: Sequelize.STRING,
      },
      token_name: {
        type: Sequelize.STRING,
      },
      reward_rate: {
        type: Sequelize.DOUBLE
      },
      min_amount_of_stakes: {
        type: Sequelize.DOUBLE
      },
      max_amount_of_stakes: {
        type: Sequelize.DOUBLE
      },
      total_token_locked: {
        type: Sequelize.DOUBLE
      },
      number_of_farmers: {
        type: Sequelize.INTEGER
      },
      nft_farm_balance: {
        type: Sequelize.INTEGER
      },
      farm_contract_address: {
        type: Sequelize.STRING
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    }, {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('farms');
  }
};