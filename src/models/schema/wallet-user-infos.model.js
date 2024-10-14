let WalletUserInfos;
const s = (builder, Sequelize) => {
  WalletUserInfos = builder.define('wallet_user_infos', {
    wallet_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'wallets',
        key: 'wallet_id'
      }
    },
    display_name: {
      type: Sequelize.STRING
    },
    avatar_url: {
      type: Sequelize.TEXT
    },
    is_admin: {
      type: Sequelize.BOOLEAN
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

  WalletUserInfos.associate = (models) => {
    WalletUserInfos.belongsTo(models.wallet, { as: 'wallet', foreignKey: 'wallet_id' });
  };
  return WalletUserInfos;
};

export { WalletUserInfos, s };
