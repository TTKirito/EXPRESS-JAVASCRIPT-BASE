'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('projects', 'project_sub_title', {
      type: Sequelize.STRING,
      after: 'project_name'
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('projects', 'project_sub_title');
  }
};
