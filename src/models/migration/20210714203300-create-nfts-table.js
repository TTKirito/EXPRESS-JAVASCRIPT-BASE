'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('nfts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(1000),
      },
      description: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.STRING(50)
      },
      supply: {
        type: Sequelize.BIGINT
      },
      token_uri: {
        type: Sequelize.STRING(1000),
      },
      token_secret_uri: {
        type: Sequelize.STRING(1000),
      },
      nft_token_id: {
        type: Sequelize.STRING(1000),
      },
      holder_wallet_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'wallets',
          key: 'wallet_id'
        }
      },
      creator_wallet_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'wallets',
          key: 'wallet_id'
        }
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
    return queryInterface.dropTable('nfts');
  }
};