'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('tokens', 'num_of_round', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('tokens', 'num_of_round');
  }
};
