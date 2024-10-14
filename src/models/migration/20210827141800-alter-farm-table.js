'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('nft_added_farms', 'farm_stake', {
        type: Sequelize.INTEGER,
        references: {
          model: 'farms',
          key: 'farm_id'
        }
      }),
      queryInterface.addColumn('nft_added_farms', 'amount_token_to_stake', {
        type: Sequelize.DOUBLE,
      }),
      queryInterface.addColumn('nft_added_farms', 'days_to_stake', {
        type: Sequelize.INTEGER,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
  }
};