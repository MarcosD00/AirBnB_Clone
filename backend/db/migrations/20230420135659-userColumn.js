"use strict";

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Users'

module.exports = {
  up: async (queryInterface, Sequelize) => {
     
    await queryInterface.addColumn(options, 'firstName', {
      type: Sequelize.STRING(30),
      allowNull: false,
    });

    await queryInterface.addColumn(options, 'lastName', {
      type: Sequelize.STRING(30),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users'
    await queryInterface.removeColumn(options, 'firstName')
    await queryInterface.removeColumn(options, 'lastName')
  }
};
