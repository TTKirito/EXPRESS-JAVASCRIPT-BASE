'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('favorited_nfts', {
      wallet_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'wallets',
            key: 'wallet_id',
          }
      },
      nft_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'nfts',
            key: 'id'
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
    return queryInterface.dropTable('favorited_nfts');
  }
};