let Understand;
const s = (builder, Sequelize) => {
  Understand = builder.define('understand', {
    understand_id: {
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
    wallet_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'wallets',
          key: 'wallet_id'
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
    timestamps: false
  });

  Understand.associate = (models) => {
    Understand.belongsTo(models.wallet, { as: 'wallet', foreignKey: 'wallet_id' });
    Understand.belongsTo(models.project, { as: 'project', foreignKey: 'project_id' });
  };

  return Understand;
};

export { Understand, s };
