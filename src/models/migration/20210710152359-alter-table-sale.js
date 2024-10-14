'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('projects', 'project_image', {
        type: Sequelize.BOOLEAN,
        after: 'project_logo',
      }),
      queryInterface.addColumn('sales', 'distribution_type', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('sales', 'distribution_date', {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn('sales', 'distribution_interval', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('sales', 'distribution_interval_period', {
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn('sales', 'first_unlock_rate', {
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn('sales', 'unlock_rate', {
        type: Sequelize.INTEGER,
      }),
    ])
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn('projects', 'project_image'),
      queryInterface.removeColumn('sales', 'distribution_type'),
      queryInterface.removeColumn('sales', 'distribution_date'),
      queryInterface.removeColumn('sales', 'distribution_interval'),
      queryInterface.removeColumn('sales', 'distribution_interval_period'),
      queryInterface.removeColumn('sales', 'first_unlock_rate'),
      queryInterface.removeColumn('sales', 'unlock_rate'),
    ])
  }
};
