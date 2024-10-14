'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('nfts', 'is_added_farm', {
      type: Sequelize.BOOLEAN,
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('nfts', 'is_added_farm');
  }
};