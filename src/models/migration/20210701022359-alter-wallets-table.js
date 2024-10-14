'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('wallets', 'is_understood_project', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: 'nick_name',
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('wallets', 'is_understood_project');
  }
};
