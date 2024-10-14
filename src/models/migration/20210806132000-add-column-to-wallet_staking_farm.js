'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('wallet_staking_farms', 'staking_balance', {
      type: Sequelize.BIGINT,
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('wallet_staking_farms', 'staking_balance');
  }
};