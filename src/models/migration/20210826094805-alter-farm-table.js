'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('farms', 'token_decimal', {
      type: Sequelize.INTEGER,
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('farms', 'token_decimal');
  }
};