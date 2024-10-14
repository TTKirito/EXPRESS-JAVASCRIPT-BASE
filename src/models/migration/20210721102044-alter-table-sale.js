'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('sales', 'distribution_date', {
        type: Sequelize.DATE,
      }),
      queryInterface.changeColumn('sales', 'distribution_interval_period', {
        type: Sequelize.INTEGER,
      }),
      queryInterface.changeColumn('sales', 'first_unlock_rate', {
        type: Sequelize.INTEGER,
      }),
      queryInterface.changeColumn('sales', 'unlock_rate', {
        type: Sequelize.INTEGER,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('sales', 'distribution_date', {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn('sales', 'distribution_interval_period', {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn('sales', 'first_unlock_rate', {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn('sales', 'unlock_rate', {
        type: Sequelize.STRING,
      }),
    ]);
  }
};
