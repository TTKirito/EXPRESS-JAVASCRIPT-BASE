'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('nfts', 'network_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'networks',
          key: 'network_id'
        }
      }),
    ])
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn('nfts', 'network_id'),
    ])
  }
};