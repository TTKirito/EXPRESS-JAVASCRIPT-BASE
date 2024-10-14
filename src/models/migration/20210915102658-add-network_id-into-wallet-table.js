'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.addColumn('wallets', 'network_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'networks',
          key: 'network_id'
        },
        after: 'wallet_id',
      }, { transaction: t }).then(() => queryInterface.addConstraint('wallets', ['network_id','wallet_address'], {
          type: 'unique',
          name: 'idx_wallet_network',
          transaction: t
        })
      );
    });
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface
        .removeConstraint('wallets', 'idx_wallet_network', { transaction: t })
        .then(() => queryInterface.removeColumn('wallets', 'network_id', { transaction: t }))
    });
  }
};
