'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('projects', 'project_image', {
      type: Sequelize.TEXT,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('projects', 'project_image', {
      type: Sequelize.BOOLEAN,
    })
  }
};
