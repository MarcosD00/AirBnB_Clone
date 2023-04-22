'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      userId: 1,
      review: "great place to stay at",
      stars: 5
    },
    {
      spotId: 2,
      userId: 2,
      review: "good place, could be better",
      stars: 3
    },
    {
      spotId: 3,
      userId: 3,
      review: "terrible place",
      stars: 1
    }
  ], {});
  
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkDelete(options);
  }
};
