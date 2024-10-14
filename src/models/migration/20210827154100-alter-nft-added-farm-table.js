"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("nft_added_farms", "farm_stake", {
      type: Sequelize.INTEGER,
    });
  },

  down: (queryInterface, Sequelize) => {},
};
