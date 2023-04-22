'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      url: "www.photo1.com",
      preview: true
    },
    {
      spotId: 2,
      url: "www.photo2.com",
      preview: true
    },
    {
      spotId: 3,
      url: "www.photo3.com",
      preview: true
    }
  ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options);
  }
};
