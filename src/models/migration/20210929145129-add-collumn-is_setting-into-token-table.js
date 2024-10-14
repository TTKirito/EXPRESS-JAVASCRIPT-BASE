'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('tokens', 'is_setting', {
      type: Sequelize.BOOLEAN
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('tokens', 'is_setting');
  }
};
