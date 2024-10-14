'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('projects', 'round', {
      type: Sequelize.INTEGER
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('projects', 'round');
  }
};
