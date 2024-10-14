'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('token_metrics', 'is_confirm', {
      type: Sequelize.BOOLEAN
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('token_metrics', 'is_confirm');
  }
};
