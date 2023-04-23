'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class Spot extends Model {

    static associate(models) {
      
      Spot.belongsTo(models.User,
        { 
          foreignKey: 'ownerId',
          onDelete: "CASCADE",
          as: 'Owner'
        }
      );

      Spot.hasMany(models.SpotImages,{
        foreignKey: 'spotId',
        onDelete: "CASCADE"
      });

      Spot.hasMany(models.Booking,{
        foreignKey: 'spotId',
        onDelete: "CASCADE"
      });

      Spot.hasMany(models.Review,{
        foreignKey: 'spotId',
        onDelete: "CASCADE"
      });

    }
  }
  Spot.init({
    ownerId:{ 
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    city:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    state:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    country:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat:{
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    lng:{
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    name:{
      type: DataTypes.STRING,
      allowNull: false,
      },
    description:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    price:{
      type: DataTypes.DECIMAL,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Spot',
    // defaultScope: {
    //   attributes: {
    //     exclude: ["createdAt", "updatedAt"]
    //   }
    // }
  });
  return Spot;
};