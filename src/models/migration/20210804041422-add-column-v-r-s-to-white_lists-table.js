'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('white_lists', 'v', {
      type: Sequelize.STRING,
    }).then(res => {
      return queryInterface.addColumn('white_lists', 'r', {
        type: Sequelize.STRING,
      }).then(res => {
        return queryInterface.addColumn('white_lists', 's', {
          type: Sequelize.STRING,
        });
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('white_lists', 'v').then(res => {
      return queryInterface.removeColumn('white_lists', 'r').then(res => {
        return queryInterface.removeColumn('white_lists', 's')
      })
    })
  }
};
