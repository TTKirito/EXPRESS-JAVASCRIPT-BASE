'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('media_nfts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      hash_name: {
        type: Sequelize.STRING(1000),
      },
      url: {
        type: Sequelize.STRING(1000)
      },
      extension: {
        type: Sequelize.STRING(50)
      },
      is_unlock_only_holders: {
        type: Sequelize.BOOLEAN
      },
      nfts_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'nfts',
          key: 'id'
        }
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    }, {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('media_nfts');
  }
};