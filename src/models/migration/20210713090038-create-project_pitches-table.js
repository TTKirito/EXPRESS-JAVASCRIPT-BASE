'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('project_pitches', {
      project_pitch_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'projects',
          key: 'project_id',
        },
      },
      uploaded_video: {
        type: Sequelize.STRING,
      },
      heading_title: {
        type: Sequelize.STRING,
      },
      navigation_title: {
        type: Sequelize.STRING,
      },
      content: {
        type: Sequelize.TEXT('long'),
      },
      order: {
        type: Sequelize.INTEGER,
      },
      display: {
        type: Sequelize.BOOLEAN,
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

  down: (queryInterface) => {
    return queryInterface.dropTable('project_pitches');
  }
};
