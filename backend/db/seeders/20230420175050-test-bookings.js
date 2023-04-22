'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotsId: 1,
        userId: 1,
        startDate: "2023-06-23",
        endDate: "2023-07-26"
      },
      {
        spotsId: 2,
        userId: 2,
        startDate: "2023-08-14",
        endDate: "2023-08-24"
      },
      {
        spotsId: 3,
        userId: 3,
        startDate: "2023-10-27",
        endDate: "2023-12-31"
      }
  ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    return queryInterface.bulkDelete(options);
  }
};
