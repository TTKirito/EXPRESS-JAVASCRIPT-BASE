'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('tokens', 'token_metrics_confirm', {
      type: Sequelize.BOOLEAN,
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('tokens', 'token_metrics_confirm');
  }
};
