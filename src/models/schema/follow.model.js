let Follow;
const s = (builder, Sequelize) => {
    Follow = builder.define('follow', {
    follow_id: {
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

  Follow.associate = (models) => {
    Follow.belongsTo(models.wallet, { as: 'wallet', foreignKey: 'wallet_id' });
    Follow.belongsTo(models.project, { as: 'project', foreignKey: 'project_id' });
  };
  return Follow;
};


export { Follow, s };
