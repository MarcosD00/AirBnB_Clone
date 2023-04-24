'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {

    static associate(models) {


      Booking.belongsTo(models.Spot,{ 
        foreignKey: 'spotId' 
      });
        
      Booking.belongsTo(models.User,{
           foreignKey: 'userId' 
      });

    }
  }
  Booking.init({
    spotId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
    userId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
    startDate:{
      type: DataTypes.DATE,
      allowNull: false,
      isDate: true
    },
    endDate:{
      type: DataTypes.DATE,
      allowNull: false,
      isDate: true
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};

