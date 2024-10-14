'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('wallet_user_infos', 'is_admin', {
      type: Sequelize.BOOLEAN,
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('wallet_user_infos', 'is_admin');
  }
};
