'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('nft_added_farms', 'required_amount', {
      type: Sequelize.FLOAT,
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('nft_added_farms', 'required_amount');
  }
};