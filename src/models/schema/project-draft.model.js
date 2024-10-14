let ProjectDraft;
const s = (builder, Sequelize) => {
  ProjectDraft = builder.define('project_draft', {
    project_draft_id: {
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
    },
    type: {
      type: Sequelize.STRING,
    },
    data: {
      type: Sequelize.TEXT('long'),
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

  ProjectDraft.associate = (models) => {

  };
  return ProjectDraft;
};

const DRAFT_TAB = {
  TOKEN: 'TOKEN',
  PROJECT: 'PROJECT',
  SALE: 'SALE',
}

export { ProjectDraft, s, DRAFT_TAB };
