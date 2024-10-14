'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('nfts', 'is_added_farm'),
      queryInterface.addColumn('nfts', 'add_farm_status', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('nfts', 'is_staking_token_lock', {
        type: Sequelize.BOOLEAN,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {

  }
};