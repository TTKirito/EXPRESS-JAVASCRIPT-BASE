'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('projects', 'sale_round_launch', {
      type: Sequelize.Sequelize.STRING
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('projects', 'sale_round_launch');
  }
};
