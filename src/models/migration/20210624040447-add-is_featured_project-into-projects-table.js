'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('projects', 'is_featured_project', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: 'is_transfer_daolaunch_fee',
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('projects', 'is_featured_project');
  }
};
