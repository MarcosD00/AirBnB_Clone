'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
    {
      reviewId: 1,
      url: "www.photo1.com"
    },
    {
      reviewId: 2,
      url: "www.photo2.com"
    },
    {
      reviewId: 3,
      url: "www.photo3.com"
    }
  ], {});
  
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options);
  }
};
