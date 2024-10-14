'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('nft_shopping_farms', {
      farm_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'farms',
          key: 'farm_id'
        }
      },
      nft_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'nfts',
          key: 'id'
        }
      },
      royalities: {
        type: Sequelize.FLOAT,
      },
      amount_nft: {
        type: Sequelize.BIGINT,
      },
      price: {
        type: Sequelize.DOUBLE
      },
      start_time: {
        type: Sequelize.DATE
      },
      end_time: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('nft_shopping_farms');
  }
};