'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('nft_added_farms', 'staking_amount', 'added_amount');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('nft_added_farms', 'added_amount', 'staking_amount');
  }
};
