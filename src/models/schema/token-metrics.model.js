let TokenMetrics;
const s = (builder, Sequelize) => {
  TokenMetrics = builder.define('token_metrics', {
    token_metrics_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    token_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'tokens',
        key: 'token_id'
      }
    },
    allocation_name: {
      type: Sequelize.STRING
    },
    lock_percent: {
      type: Sequelize.INTEGER
    },
    index_for_claim: {
      type: Sequelize.INTEGER
    },
    total_balance: {
      type: Sequelize.FLOAT
    },
    is_locked: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_confirm: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    lock_detail: {
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

  TokenMetrics.associate = (models) => {
    TokenMetrics.belongsTo(models.token, { as: 'token', foreignKey: 'token_id' });
  };
  return TokenMetrics;
};

const DISTRIBUTION_TYPES = {
  SAME_AS_LISTING: 'SAME_AS_LISTING',
  SET_DATE: 'SET_DATE',
}

const DISTRIBUTION_INTERVAL_TYPES = {
  MINUTES: 'MINUTES',
  HOURS: 'HOURS',
  DAYS: 'DAYS',
  WEEKS: 'WEEKS',
  MONTHS: 'MONTHS',
}

export { TokenMetrics, s, DISTRIBUTION_TYPES, DISTRIBUTION_INTERVAL_TYPES };
