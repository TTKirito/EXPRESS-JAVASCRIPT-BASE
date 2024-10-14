'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameTable('nft_staking_farms', 'nft_added_farms')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameTable('nft_added_farms', 'nft_staking_farms')
  }
};