let FeaturedToken;
const s = (builder, Sequelize) => {
  FeaturedToken = builder.define('featured_tokens', {
    token_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    token_name: {
      type: Sequelize.STRING
    },
    token_symbol: {
      type: Sequelize.STRING
    },
    token_contract_address: {
      type: Sequelize.STRING
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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

  FeaturedToken.associate = (models) => {

  };
  return FeaturedToken;
};

export { FeaturedToken, s };
