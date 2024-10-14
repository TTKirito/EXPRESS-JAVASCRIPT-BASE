'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('farms', 'token_contract_address', {
      type: Sequelize.STRING,
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('farms', 'token_contract_address');
  }
};