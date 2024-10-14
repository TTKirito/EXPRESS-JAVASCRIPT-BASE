let Wallet;
const s = (builder, Sequelize) => {
  Wallet = builder.define('wallet', {
    wallet_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    network_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'networks',
        key: 'network_id'
      }
    },
    wallet_type: {
      type: Sequelize.STRING
    },
    wallet_address: {
      type: Sequelize.STRING
    },
    nick_name: {
      type: Sequelize.STRING
    },
    is_understood_project: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    eth_balance: {
      type: Sequelize.STRING
    },
    usdt_balance: {
      type: Sequelize.STRING
    },
    bnb_balance: {
      type: Sequelize.STRING
    },
    busd_balance: {
      type: Sequelize.STRING
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

  Wallet.associate = (models) => {
    Wallet.hasMany(models.project, { as: 'projects', foreignKey: 'wallet_id' });
    Wallet.hasOne(models.wallet_user_infos, { as: 'wallet_user_info', foreignKey: 'wallet_id' });
    Wallet.hasMany(models.follow, { as: 'follows', foreignKey: 'wallet_id' });
    Wallet.hasMany(models.understand, { as: 'understands', foreignKey: 'wallet_id' });
  };
  return Wallet;
};

const WALLET_TYPE = {
  ETH: 'ETH',
  BSC: 'BSC',
}

export { Wallet, s, WALLET_TYPE };
