'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('nft_added_farms', 'required_amount');
  },

  down: (queryInterface) => {
  }
};