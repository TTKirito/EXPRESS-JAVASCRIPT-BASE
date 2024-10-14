'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sale_nft_in_farms', {
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
      sold_nft_quantity: {
        type: Sequelize.BIGINT,
      },
      price_of_one_nft: {
        type: Sequelize.FLOAT,
      },
      purchase_datetime: {
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
    return queryInterface.dropTable('sale_nft_in_farms');
  }
};