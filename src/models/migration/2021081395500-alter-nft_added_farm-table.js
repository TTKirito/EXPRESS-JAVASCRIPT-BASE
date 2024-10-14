'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('nft_added_farms', 'required_point', {
      type: Sequelize.DOUBLE,
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('nft_added_farms', 'required_point');
  }
};