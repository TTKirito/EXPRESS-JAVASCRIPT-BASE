let Token;
const s = (builder, Sequelize) => {
  Token = builder.define('token', {
    token_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    wallet_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'wallets',
        key: 'wallet_id'
      }
    },
    network_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'networks',
        key: 'network_id'
      }
    },
    token_symbol: {
      type: Sequelize.STRING
    },
    token_supply: {
      type: Sequelize.STRING
    },
    token_decimal_place: {
      type: Sequelize.STRING
    },
    token_name: {
      type: Sequelize.STRING
    },
    token_contract_address: {
      type: Sequelize.STRING
    },
    token_transaction_status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    token_transaction_hash: {
      type: Sequelize.STRING
    },
    uniswap_list: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    },
    token_metrics_confirm: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    is_setting: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    num_of_round: {
      type: Sequelize.INTEGER,
      defaultValue: 0
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

  Token.associate = (models) => {
    Token.belongsTo(models.wallet, { as: 'wallet', foreignKey: 'wallet_id' });
    Token.hasMany(models.token_metrics, { as: 'token_metrics', foreignKey: 'token_id' })
  };
  return Token;
};

const TRANSACTION_STATUS = {
  COMPLETED: 'COMPLETED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  FAILED: 'FAILED'
}

const APPROVAL_TYPES = {
  CREATE_TOKEN_SALE: 'CREATE_TOKEN_SALE',
  PURCHASING: 'PURCHASING'
}

export { Token, s, TRANSACTION_STATUS, APPROVAL_TYPES };
