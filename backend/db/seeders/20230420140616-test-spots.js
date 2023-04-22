'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots'
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "843 Plymouth Lane",
        city: "West New York",
        state: "NJ",
        country: "USA",
        lat: 12345.6789,
        lng: 12345.6789,
        name: "Tinsnguitch",
        description: "Big house and lovely",
        price: 250.50
      },
      {
        ownerId: 2,
        address: "462 Green Hill St",
        city: "Avon Lake",
        state: "OH",
        country: "USA",
        lat: 6789.12345,
        lng: 51234.7896,
        name: "Abingdon",
        description: "boat house, small and cozy",
        price: 180.75
      },
      {
        ownerId: 3,
        address: "15 South Laurel Ave",
        city: "Milton",
        state: "MA",
        country: "USA",
        lat: 45123.8967,
        lng: 12453.8679,
        name: "Butterpond",
        description: "2 bedroom house, its big and it a pool",
        price: 200.50
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkDelete(options);
  }
};
