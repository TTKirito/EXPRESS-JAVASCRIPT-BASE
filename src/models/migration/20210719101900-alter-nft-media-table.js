'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('media_nfts', 'file_type', {
        type: Sequelize.STRING,
      }),
      queryInterface.removeColumn('media_nfts', 'is_unlock_only_holders'),
    ])
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn('media_nfts', 'file_type'),
      queryInterface.addColumn('media_nfts', 'is_unlock_only_holders', {
        type: Sequelize.BOOLEAN
      }),
    ])
  }
};