'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class SpotImages extends Model {
    
    static associate(models) {

      SpotImages.belongsTo(models.Spot,{
        foreignKey: 'spotId',
        onDelete: "CASCADE",
      });
    }
  }
  SpotImages.init({
    spotId:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    preview:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'SpotImages',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return SpotImages;
};