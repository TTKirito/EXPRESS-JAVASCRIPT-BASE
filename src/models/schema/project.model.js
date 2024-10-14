import { bigNumber10Pow } from '../../utils/common';

let Project;
const s = (builder, Sequelize) => {
  Project = builder.define('project', {
    project_id: {
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
    project_logo: {
      type: Sequelize.STRING
    },
    project_image: {
      type: Sequelize.STRING
    },
    project_name: {
      type: Sequelize.STRING
    },
    project_sub_title: {
      type: Sequelize.STRING
    },
    project_website: {
      type: Sequelize.STRING
    },
    project_email: {
      type: Sequelize.STRING
    },
    project_white_paper: {
      type: Sequelize.STRING
    },
    project_additional_info: {
      type: Sequelize.TEXT
    },
    project_twitter: {
      type: Sequelize.STRING
    },
    project_telegram: {
      type: Sequelize.STRING
    },
    project_medium: {
      type: Sequelize.STRING
    },
    project_discord: {
      type: Sequelize.STRING
    },
    token_contract_address: {
      type: Sequelize.STRING
    },
    token_name: {
      type: Sequelize.STRING
    },
    token_symbol: {
      type: Sequelize.STRING
    },
    token_decimal: {
      type: Sequelize.INTEGER
    },
    payment_currency: {
      type: Sequelize.STRING
    },
    list_amm: {
      type: Sequelize.STRING
    },
    currency_pair: {
      type: Sequelize.STRING
    },
    contract_address: {
      type: Sequelize.STRING
    },
    pair_address: {
      type: Sequelize.STRING,
    },
    is_list_on_uniswap: {
      type: Sequelize.BOOLEAN,
    },
    is_transfer_daolaunch_fee: {
      type: Sequelize.BOOLEAN,
    },
    is_featured_project: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    sale_round_launch: {
      type: Sequelize.STRING
    },
    round: {
      type: Sequelize.INTEGER
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
    whitelist_address_csv: {
      type: Sequelize.STRING,
    },
    follow_number: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    }
  }, {
    timestamps: false
  });

  Project.associate = (models) => {
    Project.hasOne(models.sale, { as: 'sale', foreignKey: 'project_id' });
    Project.belongsTo(models.wallet, { as: 'wallet', foreignKey: 'wallet_id' });
    Project.hasOne(models.presale, { as: 'presale', foreignKey: 'project_id' });
    Project.hasMany(models.project_pitch, { as: 'project_pitches', foreignKey: 'project_id' });
    Project.hasMany(models.follow, { as: 'follows', foreignKey: 'project_id' });
    Project.hasMany(models.understand, { as: 'understands', foreignKey: 'project_id' });
  };
  return Project;
};

const TOKEN_SALE_TYPE = {
  LIVE: 'live',
  UPCOMING: 'upcoming',
  LIVE_AND_UPCOMING: 'live_and_upcoming',
  CLOSED: 'closed',
}

const calculateTotalTokensSold = (payment_currency, total_base_collected) => {
  let totalTokenSold
  switch (payment_currency) {
    case 'ETH':
      totalTokenSold = bigNumber10Pow(bigNumber10Pow(total_base_collected) / bigNumber10Pow(1, 18))
      break;
    case 'USDT':
      totalTokenSold = bigNumber10Pow(bigNumber10Pow(total_base_collected) / bigNumber10Pow(1, 6))
      break;
    case 'BNB':
      totalTokenSold = bigNumber10Pow(bigNumber10Pow(total_base_collected) / bigNumber10Pow(1, 18))
      break;
    case 'BUSD':
      totalTokenSold = bigNumber10Pow(bigNumber10Pow(total_base_collected) / bigNumber10Pow(1, 18))
      break;
  }

  return totalTokenSold
}

export {
  Project,
  s,
  TOKEN_SALE_TYPE,
  calculateTotalTokensSold,
};
