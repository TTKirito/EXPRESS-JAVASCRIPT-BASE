"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("nft_added_farms", "farm_stake");
  },

  down: (queryInterface, Sequelize) => {},
};
