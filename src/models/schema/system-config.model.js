let SystemConfig;
const s = (builder, Sequelize) => {
    SystemConfig = builder.define('system_configs', {
    system_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    key: {
      type: Sequelize.STRING
    },
    value: {
      type: Sequelize.JSON
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
    timestamps: false
  });

  SystemConfig.associate = (models) => {
  };
  return SystemConfig;
};

export { SystemConfig, s };
