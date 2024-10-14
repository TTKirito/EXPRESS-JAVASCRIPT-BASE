let ProjectPitch;
const s = (builder, Sequelize) => {
  ProjectPitch = builder.define('project_pitch', {
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
      }
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
    },
  }, {
    timestamps: false
  });

  ProjectPitch.associate = (models) => {
    ProjectPitch.belongsTo(models.project, { as: 'project', foreignKey: 'project_id' });
  };

  return ProjectPitch;
};

export { ProjectPitch, s };
