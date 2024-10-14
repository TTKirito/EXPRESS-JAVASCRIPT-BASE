'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('project_drafts', 'type', {
        type: Sequelize.STRING,
        after: 'wallet_id',
      }),
      queryInterface.addColumn('project_drafts', 'network_id', {
        type: Sequelize.INTEGER,
        after: 'wallet_id',
      }),
    ])
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn('project_drafts', 'type'),
      queryInterface.removeColumn('project_drafts', 'network_id'),
    ])
  }
};
