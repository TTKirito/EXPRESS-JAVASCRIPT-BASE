'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('token_metrics', 'total_balance', {
        type: Sequelize.FLOAT,
      }),
      queryInterface.addColumn('token_metrics', 'index_for_claim', {
        type: Sequelize.INTEGER
      }),
    ])
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn('token_metrics', 'total_balance'),
      queryInterface.removeColumn('token_metrics', 'index_for_claim'),
    ])
  }
};
